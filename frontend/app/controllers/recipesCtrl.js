angular.module('recipes').controller('recipesCtrl', ['$scope', '$location', '$http', 'recipesModel', function ($scope, $location, $http, recipesModel) {
    $scope.recipes = [];
    $scope.itemsPerPage = 9;
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.pages = [];
    $scope.paginatedRecipes = [];
    $scope.searchQuery = '';
    $scope.mealType = [
        "dinner", "lunch", "breakfast", "appetizer", "beverage", "snack", "dessert"] //Array untuk meal type

    const token = localStorage.getItem('token');

    // Fungsi untuk memeriksa token dan membatasi akses
    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        if (!token) return false; // Tidak ada token berarti belum login

        try {
            const decodedToken = jwt_decode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
            return decodedToken.exp > currentTime; // Cek apakah token expired
        } catch (error) {
            console.error('Error decoding token:', error.message);
            return false; // Token tidak valid atau rusak
        }
    };

    // Mengambil data resep dari model
    recipesModel.getRecipes().then(
        function (data) {
            $scope.recipes = data.recipes;
            $scope.totalItems = $scope.recipes.length;
            $scope.setPagination(); // Mengatur pagination
        }).catch(function (error) {
            console.error('Error in controller:', error);
        });

    // Fungsi untuk mengarahkan ke halaman detail resep
    $scope.goToRecipeDetail = function (recipeId) {
        $location.path('/recipesDetail/' + recipeId);
    };

    // Fungsi untuk menentukan item yang akan ditampilkan pada halaman tertentu
    $scope.setPagination = function () {
        $scope.pages = [];
        const maxPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        for (let i = 1; i <= maxPages; i++) {
            $scope.pages.push(i);
        }
        $scope.changePage($scope.currentPage);
    };

    // Fungsi untuk mengganti halaman
    $scope.changePage = function (page) {
        // Decode token untuk mendapatkan tipe langganan
        let subscriptionType;

        if (isLoggedIn()) {
            try {
                const decodedToken = jwt_decode(token);
                subscriptionType = decodedToken.subscription;
                console.log(decodedToken)
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        // Batasi akses halaman untuk pengguna "Basic"
        if (subscriptionType === 'Basic' && page > 1) {
            alert('Upgrade your subscription to access more pages.');
            return;
        }

        $scope.currentPage = page;
        let startIndex = (page - 1) * $scope.itemsPerPage;
        let endIndex = startIndex + $scope.itemsPerPage;
        $scope.paginatedRecipes = $scope.recipes.slice(startIndex, endIndex);
    };

    // Fungsi untuk berpindah ke halaman sebelumnya
    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.changePage($scope.currentPage - 1);
        }
    };

    // Fungsi untuk berpindah ke halaman berikutnya
    $scope.nextPage = function () {
        if (!isLoggedIn()) {
            alert("Please Login / Sign Up to access this page !")
        }
        else {
            if ($scope.currentPage < $scope.pages.length) {
                $scope.changePage($scope.currentPage + 1);
            }
        }
    };

    // Fungsi untuk memanggil API save recipes saat resep ingin disimpan
    $scope.toggleSaveRecipe = function (recipe) {
        const apiUrl = recipe.isSaved ? 'http://localhost:3000/api/unsaveRecipe' : 'http://localhost:3000/api/save-recipe';

        $http.post(apiUrl,
            { recipeId: recipe.id },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then((response) => {
            if (response.data.success) {
                recipe.isSaved = !recipe.isSaved;
            } else {
                alert('Failed to save the recipes. Try Again');
            }
        }).catch((err) => {
            console.error('Error toggling save recipe:', err);
        });
    };

    $scope.isRecipeSaved = function (recipe) {
        $http.post('http://localhost:3000/api/is-saved',
            { recipeId: recipe.id },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then((response) => {
            recipe.isSaved = response.data.isSaved;
        }).catch((err) => {
            console.error('Error checking saved status:', err);
        });
    };

    // Fungsi untuk sorting recipes by difficulty
    $scope.sortByDifficulty = () => {
        $scope.recipes = $scope.recipes.filter(recipe => recipe.difficulty === 'Easy' || recipe.difficulty === 'Medium');
        $scope.recipes.sort((a, b) => {
            const difficultyOrder = { Easy: 1, Medium: 2 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        $scope.setPagination();
    };

    // Fungsi untuk sorting cooking time dengan ascending
    $scope.sortByCookingTime = () => {
        $scope.recipes.sort((a, b) => a.cookTimeMinutes - b.cookTimeMinutes);
        $scope.setPagination();
    };

    // Fungsi untuk sorting meal type
    $scope.sortByMealType = function () {
        if (!$scope.selectedMealType) {
            console.warn("No meal type selected");
            return;
        }
        console.log("Selected meal type:", $scope.selectedMealType);


        const filteredRecipes = $scope.recipes.filter(recipe => {
            if (Array.isArray(recipe.mealType)) {
                console.log(recipe.mealType);

                return recipe.mealType.some(meal => meal.toLowerCase() === $scope.selectedMealType.toLowerCase());
            } else {
                console.warn(`Invalid mealType format for recipe:`, recipe);
                return false;
            }
        });

        $scope.recipes = filteredRecipes;

        console.log("Filtered recipes:", $scope.recipes);


        if ($scope.setPagination) {
            $scope.setPagination();
        } else {
            console.warn("Pagination function not defined");
        }
    };

    $scope.resetFilter = function () {
        $scope.selectedMealType = '';
        $scope.searchQuery = '';

        $scope.currentPage = 1;

        recipesModel.getRecipes().then(
            function (data) {
                $scope.recipes = data.recipes;
                $scope.totalItems = $scope.recipes.length;
                $scope.setPagination();
            }
        ).catch(function (error) {
            console.error('Error refetching recipes in resetFilter:', error);
        });
    };


    // Sort by rating (descending)
    $scope.sortByRating = () => {
        $scope.recipes.sort((a, b) => b.rating - a.rating);
        $scope.setPagination();
    };

    // Search by name (currently exact name)
    $scope.searchRecipes = function (query) {
        if (!query) return;

        const lowerQuery = query.toLowerCase();
        const filteredRecipes = $scope.recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(lowerQuery)
        );

        if (filteredRecipes.length === 1) {
            const recipeId = filteredRecipes[0].id;
            $location.path(`/recipesDetail/${recipeId}`);
        } else if (filteredRecipes.length > 1) {
            $scope.recipes = filteredRecipes;
        } else {
            alert("No recipes found matching your search query.");
        }
    };
}]);
