export const exerciseSeedData = [
  // Quads
  { name: 'Leg Press', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Single Leg Press', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 1, minimumLiftingExperience: 'advanced', equipmentType: 'barbell' },
  { name: 'Smith Machine Bulgarian Split Squat', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Dumbell Bulgarian Split Squat', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 3, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Barbell Split Squat', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 4, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Leg Extension', muscleGroup: 'Quads', movementPattern: 'QuadsExtension', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Single Leg Extension', muscleGroup: 'Quads', movementPattern: 'QuadsExtension', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Slow Eccentric Leg Extension', muscleGroup: 'Quads', movementPattern: 'QuadsExtension', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Hack Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'barbell' },
  { name: 'Smith Machine Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Barbell Back Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Goblet Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 3, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Safety Bar Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 5, minimumLiftingExperience: 'advanced', equipmentType: 'barbell' },

  // Hamstrings
  { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Stiff Leg Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Single-Leg Romanian Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Barbell Good Morning', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 3, minimumLiftingExperience: 'intermediate', equipmentType: 'barbell' },
  { name: 'Kettlebell Swing', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 4, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Cable Pull-Through', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 5, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Leg Curl', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsCurl', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Single Leg Curl', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsCurl', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },

  // Glutes
  { name: 'Machine Hip Thrust', muscleGroup: 'Glutes', movementPattern: 'GlutesThrust', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'machine' },
  { name: 'Barbell Hip Thrust', muscleGroup: 'Glutes', movementPattern: 'GlutesThrust', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Glute Bridge', muscleGroup: 'Glutes', movementPattern: 'GlutesThrust', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Front Foot Elevated Split Squat', muscleGroup: 'Glutes', movementPattern: 'GlutesSquat', movementPatternPriority: 0, minimumLiftingExperience: 'advanced', equipmentType: 'dumbbell' },
  { name: 'Sumo Squat', muscleGroup: 'Glutes', movementPattern: 'GlutesSquat', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Glute Abduction', muscleGroup: 'Glutes', movementPattern: 'GlutesAbduction', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Cable Kickbacks', muscleGroup: 'Glutes', movementPattern: 'GlutesAbduction', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },

  // Biceps
  { name: 'Preacher Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsLengthenedCurl', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'dumbbell' },
  { name: 'Cable Biceps Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsLengthenedCurl', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Concentration Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsShorthenedCurl', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Behind Back Cable Biceps Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsShorthenedCurl', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsBrachialis', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Reverse Grip Cable Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsBrachialis', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Preacher Hammer Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsBrachialis', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },

  // Triceps
  { name: 'JM Press', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 0, minimumLiftingExperience: 'advanced', equipmentType: 'barbell' },
  { name: 'Cable Overhead Triceps Extension', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'EZ Skull Crusher', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Dumbell Skull Crusher', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 3, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Close Grip Bench Press', muscleGroup: 'Triceps', movementPattern: 'TricepsShorthead', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'barbell' },
  { name: 'Triceps Pushdown', muscleGroup: 'Triceps', movementPattern: 'TricepsShorthead', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Diamond Pushups', muscleGroup: 'Triceps', movementPattern: 'TricepsShorthead', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'machine' },

  // Abs
  { name: 'Cable Crunch', muscleGroup: 'Abs', movementPattern: 'AbsUpper', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Crunch Machine', muscleGroup: 'Abs', movementPattern: 'AbsUpper', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Cable Reverse Crunch', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Decline Sit Up', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Decline Russian Twist', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Cable Woodchopper', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 3, minimumLiftingExperience: 'none', equipmentType: 'machine' },

  // Back
  { name: 'Lateral Pull Down', muscleGroup: 'Back', movementPattern: 'BackVerticalPull', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Pull from High Cable', muscleGroup: 'Back', movementPattern: 'BackVerticalPull', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Cable Pull Over', muscleGroup: 'Back', movementPattern: 'BackVerticalPull', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Row Machine', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Chest Supported Row', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Pendlay Row', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 2, minimumLiftingExperience: 'advanced', equipmentType: 'barbell' },
  { name: 'Dumbell Single Arm Row', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 3, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },

  // Chest
  { name: 'Smith Machine Incline Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestUpper', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'barbell' },
  { name: 'Incline Dumbell Bench Pres', muscleGroup: 'Chest', movementPattern: 'ChestUpper', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestUpper', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Chest Press Machine', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'machine' },
  { name: 'Barbell Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Dumbell Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Chest Dips', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 3, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Pec Deck', muscleGroup: 'Chest', movementPattern: 'ChestFly', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Cable Flye', muscleGroup: 'Chest', movementPattern: 'ChestFly', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Dumbell Flye', muscleGroup: 'Chest', movementPattern: 'ChestFly', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },

  // Rear Delts
  { name: 'Reverse Pec Deck', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsReverseFly', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Dumbell Rear Delt Flye', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsReverseFly', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Machine Rear Delt Row', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsRow', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Seal Row', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsRow', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
  { name: 'Cable Rear Delt Row', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsRow', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'machine' },

  // Side Delts
  { name: 'Dumbell Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellLateralRaise', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Machine Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellLateralRaise', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Lying Dumbell Side Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellIsolatedLateralRaise', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', equipmentType: 'dumbbell' },
  { name: 'Bench Supported Dumbell Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellIsolatedLateralRaise', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'dumbbell' },
  { name: 'Cable Lateral Raise', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsCableLateralRaise', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Behind the Back Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsCableLateralRaise', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Leaning Cable Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsCableLateralRaise', movementPatternPriority: 2, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Shoulder Machine Press', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsPress', movementPatternPriority: 0, minimumLiftingExperience: 'none', equipmentType: 'machine' },
  { name: 'Barbell Strict Press', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsPress', movementPatternPriority: 1, minimumLiftingExperience: 'none', equipmentType: 'barbell' },
] as const
