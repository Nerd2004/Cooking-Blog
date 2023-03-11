require('../models/database');
const { json } = require('express');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
exports.homepage = async(req,res)=>{
    try{
        
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);

       const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
       const thai = await Recipe.find({'category':'Thai'}).limit(limitNumber);
       const american = await Recipe.find({'category':'American'}).limit(limitNumber);
       const chinese = await Recipe.find({'category':'Chinese'}).limit(limitNumber);

        const food ={latest,thai,american,chinese};
       res.render('index',{title:'Cooking Blog - Home',categories,food});
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}
exports.exploreCategories = async(req,res)=>{
    try{
        
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);


        res.render('categories',{title:'Cooking Blog - Categories',categories});
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}
exports.exploreCategoriesById = async(req,res)=>{
    try{
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({'category':categoryId}).limit(limitNumber);


        res.render('categories',{title:'Cooking Blog - Categories',categoryById});
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}
exports.exploreRecipe = async(req,res) =>{
    try{
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe',{title:'Cooking Blog - Recipes',recipe});
    }
    catch(error){
        res.status(500).send({message:error.message} ||"Error Occured while connecting Recipe ejs");
    }
}

exports.searchRecipe = async(req,res) =>{
    try{
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({$text:{$search:searchTerm,$diacriticSensitive:true}});
        //let recipe = await Recipe.find({"name":searchTerm});
        //res.json(recipe);
        res.render('search',{title:'Cooking Blog - Search',recipe});
    }
    catch(error){
        res.status(500).send({message:error.message} ||"Error Occured while connecting Recipe ejs");
    }
}

exports.exploreLatest = async(req,res) =>{
    try{
        const recipe = await Recipe.find({}).sort({_id:-1});
        res.render('explore-latest',{title:'Cooking Blog - Explore Latest',recipe});
    }
    catch(error){
        res.status(500).send({message:error.message} ||"Error Occured while connecting Recipe ejs");
    }
}
exports.exploreRandom = async(req,res) =>{
    try{
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random()*count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('random',{title:'Cooking Blog - Random',recipe});
        // res.json(recipe);
    }
    catch(error){
        res.status(500).send({message:error.message} ||"Error Occured while connecting Recipe ejs");
    }
}
exports.submitRecipe = async(req,res) =>{
    try{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-recipe',{title:'Cooking Blog - Submit,',infoErrorsObj,infoSubmitObj});
        // res.json(recipe);
    }
    catch(error){
        res.status(500).send({message:error.message} ||"Error Occured while loading Submit Page");
    }
}
exports.submitRecipeOnPost = async(req,res) =>{
    try{
 
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files were uploaded.');
        }else{

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./')+'/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath,function(err){
                if(err) return res.status(500).send(err);
            })
        }
        const newRecipe = new Recipe({
           name : req.body.name,
           description : req.body.description,
           email : req.body.email,
           ingredients : req.body.ingredients,
           category : req.body.category,
           image : newImageName
        });
        await newRecipe.save();
        req.flash('infoSubmit','Recipe has been added');
        res.redirect('/submit-recipe');
        // res.json(recipe);
    }
    catch(error){
        req.flash('infoErrors',error);
        res.status(500).send({message:error.message} ||"Error Occured while Submitting");
    }
}


// async function insertDymmyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name":"Thai",
//                 "image":"thai-food.jpg"
//             },
//             {
//                 "name":"American",
//                 "image":"american-food.jpg"
//             },
//             {
//                 "name":"Chinese",
//                 "image":"chinese-food.jpg"
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg"
//             },
//             {
//                 "name":"Indian",
//                 "image":"indian-food.jpg"
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg"
//             }
//         ]);
//     }
//     catch(error){
//         console.log('err',+error);
//     }
// }
// // insertDymmyCategoryData();

// async function insertDymmyRecipeData(){
//         try{
//             await Recipe.insertMany([
//                 { 
//                 "name": "Milkshake",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "faltutestid@gmail.com",
//                 "ingredients": [
//                     "1 Cup milk",
//                     "1 level tablespoon Chocolate syrup",
//                     "1 level teaspoon honey",
//                 ],
//                 "category": "Thai", 
//                 "image": "Milkshake.jpg"
//                 },
//                 { 
//                 "name": "Dosa",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "faltutestid@gmail.com",
//                 "ingredients": [
//                     "1 Cup Rice Batter",
//                     "1 Cup Coriander Chutney",
//                     "5 Mashed Potatoes",
//                 ],
//                 "category": "Indian", 
//                 "image": "Dosa.jpg"
//                 },
//                 { 
//                 "name": "Cookie",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "faltutestid@gmail.com",
//                 "ingredients": [
//                     "2 Cups wheat flour",
//                     "100gms Dark Chocolate",
//                     "1 Cup of Milk",
//                 ],
//                 "category": "Mexican", 
//                 "image": "Cookie.jpg"
//                 },
//                 { 
//                 "name": "Chicken",
//                 "description": `Recipe Description Goes Here`,
//                 "email": "faltutestid@gmail.com",
//                 "ingredients": [
//                     "1 Alive Chicken",
//                     "1 Heartless Butcher",
//                     "Several Hungry Dogs masquerading as Humans",
//                 ],
//                 "category": "Spanish", 
//                 "image": "Chicken.jpg"
//                 },
//             ]);
//         }
//         catch(error){
//             console.log('err',+error);
//         }
//     }
//     insertDymmyRecipeData();

    