const client = require('../config/db');

// function untuk saved recipes
const saveRecipe = (userId, recipeId) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)';
        const values = [userId, recipeId];

        client.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// function untuk check apakah data tersimpan
const isRecipeSaved = (userId, recipeId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2';
        const values = [userId, recipeId];

        client.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.rows.length > 0);  
        });
    });
};

// Function untuk mengecek resep apa aja yang disimpan user
const getSavedRecipesByUserId = async (userId) => {
    try {
        const query = `
            SELECT *
            FROM saved_recipes
            WHERE user_id = $1;
        `;
        
        const result = await client.query(query, [userId]);
        
        return result.rows;
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        throw new Error('Database query failed');
    }
};

// Function untuk menghapus resep yang disimpan user
const deleteSavedRecipe = (userId, recipeId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2';
        const values = [userId, recipeId];

        client.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};


module.exports = {
    saveRecipe,
    isRecipeSaved,
    getSavedRecipesByUserId,
    deleteSavedRecipe
};