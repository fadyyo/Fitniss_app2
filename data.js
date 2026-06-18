// Expanded Food Database - Categorized by Meal Type (200+ items)
const FOODS = {
    // Breakfast Foods (30+ items)
    breakfast: [
        { name: 'Oatmeal with Honey', emoji: '🥣', kcal: 285, protein: 10, carbs: 50, fat: 5, weight: '250g' },
        { name: 'Scrambled Eggs', emoji: '🥚', kcal: 215, protein: 18, carbs: 2, fat: 15, weight: '150g' },
        { name: 'Greek Yogurt', emoji: '🥛', kcal: 176, protein: 15, carbs: 20, fat: 4, weight: '200g' },
        { name: 'Whole Wheat Toast', emoji: '🍞', kcal: 151, protein: 6, carbs: 25, fat: 3, weight: '2 slices' },
        { name: 'Pancakes (Protein)', emoji: '🥞', kcal: 312, protein: 25, carbs: 35, fat: 8, weight: '3 small' },
        { name: 'Avocado Toast', emoji: '🥑', kcal: 296, protein: 8, carbs: 30, fat: 16, weight: '1 slice' },
        { name: 'Cheese Omelette', emoji: '🍳', kcal: 308, protein: 20, carbs: 3, fat: 24, weight: '2 eggs' },
        { name: 'Peanut Butter Banana', emoji: '🍌', kcal: 363, protein: 12, carbs: 45, fat: 15, weight: '1 slice' },
        { name: 'Cottage Cheese Bowl', emoji: '🧀', kcal: 157, protein: 25, carbs: 12, fat: 1, weight: '200g' },
        { name: 'Smoothie Bowl', emoji: '🍧', kcal: 314, protein: 10, carbs: 55, fat: 6, weight: '300g' },
        { name: 'Granola with Berries', emoji: '🫐', kcal: 342, protein: 8, carbs: 55, fat: 10, weight: '250g' },
        { name: 'Bagel with Cream Cheese', emoji: '🥯', kcal: 396, protein: 12, carbs: 60, fat: 12, weight: '1 bagel' },
        { name: 'French Toast', emoji: '🍞', kcal: 354, protein: 12, carbs: 45, fat: 14, weight: '2 slices' },
        { name: 'Waffles with Syrup', emoji: '🧇', kcal: 415, protein: 10, carbs: 60, fat: 15, weight: '2 waffles' },
        { name: 'Cereal with Milk', emoji: '🥣', kcal: 248, protein: 8, carbs: 45, fat: 4, weight: '200ml' },
        { name: 'Egg White Scramble', emoji: '🥚', kcal: 114, protein: 22, carbs: 2, fat: 2, weight: '150g' },
        { name: 'Chia Seed Pudding', emoji: '🌱', kcal: 286, protein: 12, carbs: 28, fat: 14, weight: '200g' },
        { name: 'Acai Bowl', emoji: '🫐', kcal: 360, protein: 8, carbs: 55, fat: 12, weight: '300g' },
        { name: 'Breakfast Burrito', emoji: '🌯', kcal: 442, protein: 20, carbs: 50, fat: 18, weight: '1 burrito' },
        { name: 'Protein Pancakes', emoji: '🥞', kcal: 274, protein: 30, carbs: 25, fat: 6, weight: '2 pancakes' },
        { name: 'Almond Butter Toast', emoji: '🍞', kcal: 278, protein: 10, carbs: 28, fat: 14, weight: '1 slice' },
        { name: 'Fruit Salad', emoji: '🍎', kcal: 137, protein: 2, carbs: 30, fat: 1, weight: '250g' },
        { name: 'Honey Toast', emoji: '🍞', kcal: 205, protein: 5, carbs: 35, fat: 5, weight: '1 slice' },
        { name: 'Boiled Eggs', emoji: '🥚', kcal: 155, protein: 13, carbs: 1, fat: 11, weight: '2 eggs' },
        { name: 'Overnight Oats', emoji: '🥣', kcal: 319, protein: 12, carbs: 52, fat: 7, weight: '250g' },
    ],
    // Lunch Foods (25+ items)
    lunch: [
        { name: 'Grilled Chicken Breast', emoji: '🍗', kcal: 160, protein: 31, carbs: 0, fat: 4, weight: '150g' },
        { name: 'Tuna Salad', emoji: '🥗', kcal: 204, protein: 28, carbs: 5, fat: 8, weight: '200g' },
        { name: 'Turkey Sandwich', emoji: '🥪', kcal: 350, protein: 25, carbs: 40, fat: 10, weight: '1 sandwich' },
        { name: 'Caesar Salad', emoji: '🥗', kcal: 300, protein: 12, carbs: 18, fat: 20, weight: '300g' },
        { name: 'Brown Rice & Beans', emoji: '🍚', kcal: 371, protein: 14, carbs: 72, fat: 3, weight: '350g' },
        { name: 'Chicken Wrap', emoji: '🌯', kcal: 408, protein: 30, carbs: 45, fat: 12, weight: '1 wrap' },
        { name: 'Beef Burger', emoji: '🍔', kcal: 552, protein: 30, carbs: 45, fat: 28, weight: '1 burger' },
        { name: 'Pasta with Tomato Sauce', emoji: '🍝', kcal: 382, protein: 12, carbs: 70, fat: 6, weight: '300g' },
        { name: 'Grilled Salmon', emoji: '🐟', kcal: 273, protein: 39, carbs: 0, fat: 13, weight: '200g' },
        { name: 'Quinoa Bowl', emoji: '🥗', kcal: 340, protein: 12, carbs: 55, fat: 8, weight: '300g' },
        { name: 'Chicken Stir Fry', emoji: '🍳', kcal: 340, protein: 28, carbs: 30, fat: 12, weight: '300g' },
        { name: 'Lentil Soup', emoji: '🍲', kcal: 241, protein: 18, carbs: 40, fat: 1, weight: '400ml' },
        { name: 'Sushi Rolls', emoji: '🍣', kcal: 304, protein: 12, carbs: 55, fat: 4, weight: '8 pieces' },
        { name: 'Greek Salad', emoji: '🥗', kcal: 198, protein: 6, carbs: 12, fat: 14, weight: '250g' },
        { name: 'Shrimp Tacos', emoji: '🌮', kcal: 374, protein: 24, carbs: 38, fat: 14, weight: '2 tacos' },
        { name: 'Veggie Bowl', emoji: '🥙', kcal: 284, protein: 8, carbs: 45, fat: 8, weight: '300g' },
        { name: 'Chicken Shawarma', emoji: '🌯', kcal: 440, protein: 32, carbs: 42, fat: 16, weight: '1 wrap' },
        { name: 'Beef Steak', emoji: '🥩', kcal: 414, protein: 45, carbs: 0, fat: 26, weight: '200g' },
        { name: 'Falafel Wrap', emoji: '🫓', kcal: 400, protein: 14, carbs: 50, fat: 16, weight: '1 wrap' },
        { name: 'Tuna Poke Bowl', emoji: '🍱', kcal: 332, protein: 30, carbs: 35, fat: 8, weight: '300g' },
        { name: 'Sweet Potato & Chicken', emoji: '🍠', kcal: 392, protein: 32, carbs: 48, fat: 8, weight: '350g' },
        { name: 'Grilled Veggie Sandwich', emoji: '🥪', kcal: 297, protein: 10, carbs: 44, fat: 9, weight: '1 sandwich' },
        { name: 'Chicken Noodle Soup', emoji: '🍜', kcal: 212, protein: 18, carbs: 26, fat: 4, weight: '400ml' },
        { name: 'Beef Stew', emoji: '🍲', kcal: 366, protein: 28, carbs: 32, fat: 14, weight: '350g' },
        { name: 'Protein Salad Bowl', emoji: '🥗', kcal: 316, protein: 34, carbs: 18, fat: 12, weight: '300g' },
    ],
    // Dinner Foods (25+ items)
    dinner: [
        { name: 'Baked Salmon with Veggies', emoji: '🐟', kcal: 390, protein: 42, carbs: 15, fat: 18, weight: '350g' },
        { name: 'Grilled Chicken & Broccoli', emoji: '🍗', kcal: 290, protein: 38, carbs: 12, fat: 10, weight: '350g' },
        { name: 'Beef Steak & Sweet Potato', emoji: '🥩', kcal: 530, protein: 45, carbs: 38, fat: 22, weight: '400g' },
        { name: 'Turkey Meatballs', emoji: '🍝', kcal: 424, protein: 35, carbs: 35, fat: 16, weight: '350g' },
        { name: 'Shrimp Stir Fry', emoji: '🍤', kcal: 290, protein: 28, carbs: 22, fat: 10, weight: '300g' },
        { name: 'Chicken Curry & Rice', emoji: '🍛', kcal: 478, protein: 30, carbs: 58, fat: 14, weight: '400g' },
        { name: 'Pork Tenderloin', emoji: '🥩', kcal: 322, protein: 40, carbs: 0, fat: 18, weight: '250g' },
        { name: 'Vegetable Pasta', emoji: '🍝', kcal: 368, protein: 12, carbs: 62, fat: 8, weight: '350g' },
        { name: 'Grilled Sea Bass', emoji: '🐠', kcal: 266, protein: 35, carbs: 0, fat: 14, weight: '250g' },
        { name: 'Lamb Chops & Asparagus', emoji: '🍖', kcal: 470, protein: 42, carbs: 8, fat: 30, weight: '350g' },
        { name: 'Chicken Fajitas', emoji: '🌮', kcal: 406, protein: 32, carbs: 38, fat: 14, weight: '2 fajitas' },
        { name: 'Tuna Steak', emoji: '🐟', kcal: 284, protein: 44, carbs: 0, fat: 12, weight: '250g' },
        { name: 'Beef Tacos', emoji: '🌮', kcal: 444, protein: 28, carbs: 38, fat: 20, weight: '2 tacos' },
        { name: 'Roast Chicken', emoji: '🍗', kcal: 364, protein: 46, carbs: 0, fat: 20, weight: '300g' },
        { name: 'Stuffed Bell Peppers', emoji: '🫑', kcal: 344, protein: 24, carbs: 35, fat: 12, weight: '2 peppers' },
        { name: 'Salmon Teriyaki', emoji: '🐟', kcal: 410, protein: 40, carbs: 22, fat: 18, weight: '300g' },
        { name: 'Chicken & Quinoa', emoji: '🍗', kcal: 402, protein: 38, carbs: 40, fat: 10, weight: '350g' },
        { name: 'Beef Kabobs', emoji: '🍢', kcal: 374, protein: 36, carbs: 8, fat: 22, weight: '300g' },
        { name: 'Baked Cod with Salad', emoji: '🐡', kcal: 264, protein: 38, carbs: 10, fat: 8, weight: '300g' },
        { name: 'Chicken Caesar Wrap', emoji: '🌯', kcal: 432, protein: 32, carbs: 40, fat: 16, weight: '1 wrap' },
        { name: 'Grilled Tofu Plate', emoji: '🥗', kcal: 260, protein: 20, carbs: 18, fat: 12, weight: '300g' },
        { name: 'Pasta Bolognese', emoji: '🍝', kcal: 488, protein: 28, carbs: 58, fat: 16, weight: '350g' },
        { name: 'Chicken Souvlaki', emoji: '🍡', kcal: 324, protein: 34, carbs: 20, fat: 12, weight: '300g' },
        { name: 'Baked Chicken Thighs', emoji: '🍗', kcal: 360, protein: 36, carbs: 0, fat: 24, weight: '250g' },
        { name: 'Mediterranean Bowl', emoji: '🥗', kcal: 386, protein: 20, carbs: 45, fat: 14, weight: '350g' },
    ],
    // Snacks
    snacks: [
        { name: 'Protein Bar', emoji: '🍫', kcal: 243, protein: 20, carbs: 25, fat: 7, weight: '60g' },
        { name: 'Mixed Nuts', emoji: '🥜', kcal: 196, protein: 5, carbs: 8, fat: 16, weight: '30g' },
        { name: 'Apple with Almond Butter', emoji: '🍎', kcal: 218, protein: 4, carbs: 28, fat: 10, weight: '1 apple + 2tbsp' },
        { name: 'Banana', emoji: '🍌', kcal: 96, protein: 1, carbs: 23, fat: 0, weight: '1 medium' },
        { name: 'Protein Shake', emoji: '🥤', kcal: 150, protein: 25, carbs: 8, fat: 2, weight: '350ml' },
        { name: 'Rice Cakes', emoji: '🍘', kcal: 105, protein: 2, carbs: 22, fat: 1, weight: '2 cakes' },
        { name: 'Greek Yogurt', emoji: '🥛', kcal: 119, protein: 15, carbs: 8, fat: 3, weight: '150g' },
        { name: 'Hard Boiled Eggs', emoji: '🥚', kcal: 142, protein: 12, carbs: 1, fat: 10, weight: '2 eggs' },
    ],
    // Protein sources
    protein: [
        { name: 'Chicken Breast', emoji: '🍗', kcal: 160, protein: 31, carbs: 0, fat: 4, weight: '150g' },
        { name: 'Salmon Fillet', emoji: '🐟', kcal: 273, protein: 39, carbs: 0, fat: 13, weight: '200g' },
        { name: 'Beef Sirloin', emoji: '🥩', kcal: 230, protein: 26, carbs: 0, fat: 14, weight: '150g' },
        { name: 'Turkey Breast', emoji: '🦃', kcal: 129, protein: 30, carbs: 0, fat: 1, weight: '150g' },
        { name: 'Tuna in Water', emoji: '🐟', kcal: 109, protein: 25, carbs: 0, fat: 1, weight: '150g' },
        { name: 'Whole Eggs', emoji: '🥚', kcal: 155, protein: 13, carbs: 1, fat: 11, weight: '2 eggs' },
        { name: 'Whey Protein', emoji: '🥤', kcal: 126, protein: 24, carbs: 3, fat: 2, weight: '1 scoop' },
        { name: 'Greek Yogurt', emoji: '🥛', kcal: 105, protein: 18, carbs: 6, fat: 1, weight: '150g' },
        { name: 'Cottage Cheese', emoji: '🧀', kcal: 133, protein: 25, carbs: 6, fat: 1, weight: '200g' },
        { name: 'Shrimp', emoji: '🍤', kcal: 114, protein: 23, carbs: 1, fat: 2, weight: '150g' },
        { name: 'Pork Tenderloin', emoji: '🥩', kcal: 170, protein: 29, carbs: 0, fat: 6, weight: '150g' },
        { name: 'Edamame', emoji: '🫛', kcal: 125, protein: 11, carbs: 9, fat: 5, weight: '100g' },
    ],
    // Carbs
    carbs: [
        { name: 'Brown Rice', emoji: '🍚', kcal: 218, protein: 5, carbs: 45, fat: 2, weight: '200g cooked' },
        { name: 'Sweet Potato', emoji: '🍠', kcal: 184, protein: 4, carbs: 42, fat: 0, weight: '200g' },
        { name: 'Whole Wheat Pasta', emoji: '🍝', kcal: 222, protein: 8, carbs: 43, fat: 2, weight: '100g dry' },
        { name: 'Quinoa', emoji: '🥗', kcal: 228, protein: 8, carbs: 40, fat: 4, weight: '185g cooked' },
        { name: 'Oats', emoji: '🥣', kcal: 155, protein: 5, carbs: 27, fat: 3, weight: '40g dry' },
        { name: 'White Rice', emoji: '🍚', kcal: 192, protein: 4, carbs: 44, fat: 0, weight: '185g cooked' },
        { name: 'Whole Grain Bread', emoji: '🍞', kcal: 85, protein: 4, carbs: 15, fat: 1, weight: '1 slice' },
        { name: 'Banana', emoji: '🍌', kcal: 96, protein: 1, carbs: 23, fat: 0, weight: '1 medium' },
        { name: 'Lentils', emoji: '🫘', kcal: 241, protein: 18, carbs: 40, fat: 1, weight: '200g cooked' },
        { name: 'Black Beans', emoji: '🫘', kcal: 229, protein: 15, carbs: 40, fat: 1, weight: '200g' },
        { name: 'Chickpeas', emoji: '🫘', kcal: 276, protein: 15, carbs: 45, fat: 4, weight: '200g' },
        { name: 'Corn Tortilla', emoji: '🫓', kcal: 61, protein: 1, carbs: 12, fat: 1, weight: '1 medium' },
    ],
    // Vegetables
    vegetables: [
        { name: 'Broccoli', emoji: '🥦', kcal: 65, protein: 4, carbs: 10, fat: 1, weight: '200g' },
        { name: 'Spinach', emoji: '🥬', kcal: 28, protein: 3, carbs: 4, fat: 0, weight: '100g' },
        { name: 'Mixed Greens Salad', emoji: '🥗', kcal: 16, protein: 1, carbs: 3, fat: 0, weight: '100g' },
        { name: 'Bell Peppers', emoji: '🫑', kcal: 32, protein: 1, carbs: 7, fat: 0, weight: '150g' },
        { name: 'Asparagus', emoji: '🌿', kcal: 44, protein: 4, carbs: 7, fat: 0, weight: '200g' },
        { name: 'Zucchini', emoji: '🥒', kcal: 36, protein: 3, carbs: 6, fat: 0, weight: '200g' },
        { name: 'Green Beans', emoji: '🫛', kcal: 48, protein: 2, carbs: 10, fat: 0, weight: '200g' },
        { name: 'Cauliflower', emoji: '🤍', kcal: 56, protein: 4, carbs: 10, fat: 0, weight: '200g' },
        { name: 'Cherry Tomatoes', emoji: '🍅', kcal: 28, protein: 1, carbs: 6, fat: 0, weight: '150g' },
        { name: 'Cucumber', emoji: '🥒', kcal: 20, protein: 1, carbs: 4, fat: 0, weight: '150g' },
        { name: 'Kale', emoji: '🥬', kcal: 61, protein: 3, carbs: 10, fat: 1, weight: '100g' },
        { name: 'Edamame', emoji: '🫛', kcal: 125, protein: 11, carbs: 9, fat: 5, weight: '100g' },
    ],
    // Fruits
    fruits: [
        { name: 'Mixed Berries', emoji: '🫐', kcal: 72, protein: 1, carbs: 17, fat: 0, weight: '150g' },
        { name: 'Apple', emoji: '🍎', kcal: 100, protein: 0, carbs: 25, fat: 0, weight: '1 medium' },
        { name: 'Banana', emoji: '🍌', kcal: 96, protein: 1, carbs: 23, fat: 0, weight: '1 medium' },
        { name: 'Orange', emoji: '🍊', kcal: 64, protein: 1, carbs: 15, fat: 0, weight: '1 medium' },
        { name: 'Mango', emoji: '🥭', kcal: 113, protein: 1, carbs: 25, fat: 1, weight: '165g' },
        { name: 'Pineapple', emoji: '🍍', kcal: 88, protein: 1, carbs: 21, fat: 0, weight: '165g' },
        { name: 'Watermelon', emoji: '🍉', kcal: 96, protein: 2, carbs: 22, fat: 0, weight: '300g' },
        { name: 'Grapes', emoji: '🍇', kcal: 112, protein: 1, carbs: 27, fat: 0, weight: '150g' },
        { name: 'Strawberries', emoji: '🍓', kcal: 52, protein: 1, carbs: 12, fat: 0, weight: '150g' },
        { name: 'Peach', emoji: '🍑', kcal: 60, protein: 1, carbs: 14, fat: 0, weight: '150g' },
        { name: 'Kiwi', emoji: '🥝', kcal: 44, protein: 1, carbs: 10, fat: 0, weight: '1 medium' },
        { name: 'Pear', emoji: '🍐', kcal: 112, protein: 1, carbs: 27, fat: 0, weight: '1 medium' },
    ]
};

// Workouts Database
const WORKOUTS = {
    beginner: [
        {
            name: 'Full Body Circuit',
            emoji: '💪',
            duration: 30,
            intensity: 'Low',
            calories: '200-280',
            description: 'A gentle full body circuit designed for beginners to build foundational strength.',
            videoUrl: 'https://www.youtube.com/results?search_query=beginner+full+body+workout',
            exercises: [
                { name: 'Push-Ups', sets: 3, reps: '8-10', desc: 'Modified on knees if needed', muscles: 'Chest, Shoulders, Triceps' },
                { name: 'Bodyweight Squats', sets: 3, reps: '12-15', desc: 'Focus on proper form', muscles: 'Quads, Glutes, Hamstrings' },
                { name: 'Plank Hold', sets: 3, reps: '20-30s', desc: 'Keep core tight', muscles: 'Core, Shoulders' },
                { name: 'Glute Bridges', sets: 3, reps: '12-15', desc: 'Squeeze at the top', muscles: 'Glutes, Hamstrings' },
                { name: 'Mountain Climbers', sets: 2, reps: '15 each', desc: 'Controlled pace', muscles: 'Core, Shoulders' }
            ]
        },
        {
            name: 'Cardio Walk & Stretch',
            emoji: '🚶',
            duration: 35,
            intensity: 'Low',
            calories: '150-200',
            description: 'Easy cardiovascular workout with dynamic stretching for flexibility.',
            videoUrl: 'https://www.youtube.com/results?search_query=beginner+cardio+workout',
            exercises: [
                { name: 'Brisk Walk', sets: 1, reps: '20 min', desc: 'Maintain steady pace', muscles: 'Full Body, Cardiovascular' },
                { name: 'Leg Swings', sets: 2, reps: '10 each', desc: 'Front and side', muscles: 'Hip Flexors, Glutes' },
                { name: 'Arm Circles', sets: 2, reps: '15 each direction', desc: 'Large controlled circles', muscles: 'Shoulders, Upper Back' },
                { name: 'Standing Stretches', sets: 1, reps: '5 min', desc: 'Hold each 30 seconds', muscles: 'Full Body Flexibility' }
            ]
        },
        {
            name: 'Core & Flexibility',
            emoji: '🧘',
            duration: 25,
            intensity: 'Low',
            calories: '120-160',
            description: 'Core strengthening combined with flexibility work for better posture.',
            videoUrl: 'https://www.youtube.com/results?search_query=beginner+core+flexibility+workout',
            exercises: [
                { name: 'Cat-Cow Stretch', sets: 2, reps: '10 each', desc: 'Slow and controlled breathing', muscles: 'Spine, Core' },
                { name: 'Dead Bug', sets: 3, reps: '8 each side', desc: 'Opposite arm and leg', muscles: 'Core, Stability' },
                { name: 'Child\'s Pose', sets: 2, reps: '30s hold', desc: 'Breathe deeply', muscles: 'Back, Hips, Shoulders' },
                { name: 'Leg Raises', sets: 3, reps: '10-12', desc: 'Lower back flat on floor', muscles: 'Lower Abs, Hip Flexors' }
            ]
        }
    ],
    intermediate: [
        {
            name: 'Push Day',
            emoji: '🏋️',
            duration: 50,
            intensity: 'Medium',
            calories: '350-450',
            description: 'Chest, shoulders and triceps focused workout for upper body pushing strength.',
            videoUrl: 'https://www.youtube.com/results?search_query=push+day+workout',
            exercises: [
                { name: 'Bench Press', sets: 4, reps: '8-10', desc: 'Full range of motion', muscles: 'Chest, Triceps, Shoulders' },
                { name: 'Overhead Press', sets: 3, reps: '8-10', desc: 'Core tight throughout', muscles: 'Shoulders, Triceps' },
                { name: 'Dips', sets: 3, reps: '10-12', desc: 'Lean forward for chest emphasis', muscles: 'Chest, Triceps' },
                { name: 'Lateral Raises', sets: 3, reps: '12-15', desc: 'Slight bend in elbows', muscles: 'Lateral Deltoids' },
                { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', desc: 'Keep elbows at sides', muscles: 'Triceps' }
            ]
        },
        {
            name: 'Pull Day',
            emoji: '🤸',
            duration: 50,
            intensity: 'Medium',
            calories: '350-450',
            description: 'Back and biceps focused workout for upper body pulling strength.',
            videoUrl: 'https://www.youtube.com/results?search_query=pull+day+workout',
            exercises: [
                { name: 'Pull-Ups / Lat Pulldowns', sets: 4, reps: '6-10', desc: 'Full stretch at bottom', muscles: 'Lats, Biceps' },
                { name: 'Barbell Rows', sets: 3, reps: '8-10', desc: 'Hinge at hips, flat back', muscles: 'Upper Back, Biceps' },
                { name: 'Face Pulls', sets: 3, reps: '15', desc: 'External rotation at peak', muscles: 'Rear Delts, Rotator Cuff' },
                { name: 'Hammer Curls', sets: 3, reps: '12', desc: 'Neutral grip throughout', muscles: 'Biceps, Brachialis' },
                { name: 'Seated Cable Rows', sets: 3, reps: '12', desc: 'Squeeze shoulder blades', muscles: 'Mid Back, Biceps' }
            ]
        },
        {
            name: 'Leg Day',
            emoji: '🦵',
            duration: 55,
            intensity: 'High',
            calories: '400-500',
            description: 'Comprehensive lower body workout targeting all major leg muscle groups.',
            videoUrl: 'https://www.youtube.com/results?search_query=leg+day+workout',
            exercises: [
                { name: 'Barbell Squats', sets: 4, reps: '8-10', desc: 'Break parallel if possible', muscles: 'Quads, Glutes, Core' },
                { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', desc: 'Slight knee bend, hinge back', muscles: 'Hamstrings, Glutes' },
                { name: 'Walking Lunges', sets: 3, reps: '12 each', desc: 'Big step forward', muscles: 'Quads, Glutes, Balance' },
                { name: 'Leg Press', sets: 3, reps: '12-15', desc: 'Feet shoulder width apart', muscles: 'Quads, Glutes' },
                { name: 'Calf Raises', sets: 4, reps: '20', desc: 'Full range of motion', muscles: 'Gastrocnemius, Soleus' }
            ]
        }
    ],
    advanced: [
        {
            name: 'Hypertrophy Upper',
            emoji: '🔥',
            duration: 70,
            intensity: 'Very High',
            calories: '500-650',
            description: 'Advanced upper body hypertrophy session with volume overload techniques.',
            videoUrl: 'https://www.youtube.com/results?search_query=advanced+upper+body+hypertrophy',
            exercises: [
                { name: 'Barbell Bench Press', sets: 5, reps: '5 (heavy)', desc: 'Pyramid loading scheme', muscles: 'Chest, Triceps, Front Delts' },
                { name: 'Weighted Pull-Ups', sets: 4, reps: '6-8', desc: 'Add 10-20kg belt weight', muscles: 'Lats, Biceps, Teres Major' },
                { name: 'Incline DB Press', sets: 4, reps: '10-12', desc: '30-45 degree incline', muscles: 'Upper Chest, Shoulders' },
                { name: 'Cable Rows', sets: 4, reps: '10-12', desc: 'Slow eccentric 3 seconds', muscles: 'Rhomboids, Mid Traps' },
                { name: 'Overhead Press', sets: 3, reps: '8', desc: 'Strict form, no leg drive', muscles: 'Shoulders, Triceps' },
                { name: 'Superset: Curls + Pushdowns', sets: 3, reps: '12+12', desc: 'Minimal rest between', muscles: 'Biceps + Triceps' }
            ]
        },
        {
            name: 'Powerlifting Lower',
            emoji: '⚡',
            duration: 75,
            intensity: 'Very High',
            calories: '550-700',
            description: 'Strength-focused lower body session using powerlifting principles.',
            videoUrl: 'https://www.youtube.com/results?search_query=powerlifting+leg+day',
            exercises: [
                { name: 'Back Squats', sets: 5, reps: '3-5 (85% 1RM)', desc: 'Competition depth', muscles: 'Quads, Glutes, Core, Back' },
                { name: 'Conventional Deadlifts', sets: 4, reps: '3-4 (80% 1RM)', desc: 'Brace hard, drive through floor', muscles: 'Posterior Chain, Traps' },
                { name: 'Pause Squats', sets: 3, reps: '4 (65%)', desc: '2 second pause at bottom', muscles: 'Quads, Core stability' },
                { name: 'Hip Thrusts', sets: 4, reps: '10', desc: 'Barbell on hip crease', muscles: 'Glutes, Hamstrings' },
                { name: 'Bulgarian Split Squats', sets: 3, reps: '8 each', desc: 'Rear foot elevated', muscles: 'Quads, Glutes, Balance' }
            ]
        }
    ]
};
