export const exerciseSeedData = [
  // Quads
  { name: 'Leg Press', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Single Leg Press', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 1, minimumLiftingExperience: 'advanced', loadingType: 'double_plates' },
  { name: 'Smith Machine Bulgarian Split Squat', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Dumbell Bulgarian Split Squat', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 3, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Barbell Split Squat', muscleGroup: 'Quads', movementPattern: 'QuadsPress', movementPatternPriority: 4, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Leg Extension', muscleGroup: 'Quads', movementPattern: 'QuadsExtension', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Single Leg Extension', muscleGroup: 'Quads', movementPattern: 'QuadsExtension', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Slow Eccentric Leg Extension', muscleGroup: 'Quads', movementPattern: 'QuadsExtension', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Hack Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'double_plates' },
  { name: 'Smith Machine Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Barbell Back Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Goblet Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 3, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Safety Bar Squat', muscleGroup: 'Quads', movementPattern: 'QuadsSquat', movementPatternPriority: 5, minimumLiftingExperience: 'advanced', loadingType: 'double_plates' },

  // Hamstrings
  { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Stiff Leg Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Single-Leg Romanian Deadlift', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Barbell Good Morning', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 3, minimumLiftingExperience: 'intermediate', loadingType: 'double_plates' },
  { name: 'Kettlebell Swing', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 4, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Cable Pull-Through', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsHipHinge', movementPatternPriority: 5, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Leg Curl', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsCurl', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Single Leg Curl', muscleGroup: 'Hamstrings', movementPattern: 'HamstringsCurl', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },

  // Glutes
  { name: 'Machine Hip Thrust', muscleGroup: 'Glutes', movementPattern: 'GlutesThrust', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'stack' },
  { name: 'Barbell Hip Thrust', muscleGroup: 'Glutes', movementPattern: 'GlutesThrust', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Glute Bridge', muscleGroup: 'Glutes', movementPattern: 'GlutesThrust', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Front Foot Elevated Split Squat', muscleGroup: 'Glutes', movementPattern: 'GlutesSquat', movementPatternPriority: 0, minimumLiftingExperience: 'advanced', loadingType: 'dumbbell' },
  { name: 'Sumo Squat', muscleGroup: 'Glutes', movementPattern: 'GlutesSquat', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Glute Abduction', muscleGroup: 'Glutes', movementPattern: 'GlutesAbduction', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Cable Kickbacks', muscleGroup: 'Glutes', movementPattern: 'GlutesAbduction', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },

  // Biceps
  { name: 'Preacher Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsLengthenedCurl', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'dumbbell' },
  { name: 'Cable Biceps Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsLengthenedCurl', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Concentration Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsShorthenedCurl', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Behind Back Cable Biceps Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsShorthenedCurl', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsBrachialis', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Reverse Grip Cable Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsBrachialis', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Preacher Hammer Curl', muscleGroup: 'Biceps', movementPattern: 'BicepsBrachialis', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },

  // Triceps
  { name: 'JM Press', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 0, minimumLiftingExperience: 'advanced', loadingType: 'double_plates' },
  { name: 'Cable Overhead Triceps Extension', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'EZ Skull Crusher', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Dumbell Skull Crusher', muscleGroup: 'Triceps', movementPattern: 'TricepsLonghead', movementPatternPriority: 3, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Close Grip Bench Press', muscleGroup: 'Triceps', movementPattern: 'TricepsShorthead', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'double_plates' },
  { name: 'Triceps Pushdown', muscleGroup: 'Triceps', movementPattern: 'TricepsShorthead', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Diamond Pushups', muscleGroup: 'Triceps', movementPattern: 'TricepsShorthead', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'plates' },

  // Abs
  { name: 'Cable Crunch', muscleGroup: 'Abs', movementPattern: 'AbsUpper', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Crunch Machine', muscleGroup: 'Abs', movementPattern: 'AbsUpper', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Cable Reverse Crunch', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Decline Sit Up', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'plates' },
  { name: 'Decline Russian Twist', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'plates' },
  { name: 'Cable Woodchopper', muscleGroup: 'Abs', movementPattern: 'AbsLower', movementPatternPriority: 3, minimumLiftingExperience: 'none', loadingType: 'stack' },

  // Back
  { name: 'Lateral Pull Down', muscleGroup: 'Back', movementPattern: 'BackVerticalPull', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Pull from High Cable', muscleGroup: 'Back', movementPattern: 'BackVerticalPull', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Cable Pull Over', muscleGroup: 'Back', movementPattern: 'BackVerticalPull', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Row Machine', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Chest Supported Row', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Pendlay Row', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 2, minimumLiftingExperience: 'advanced', loadingType: 'double_plates' },
  { name: 'Dumbell Single Arm Row', muscleGroup: 'Back', movementPattern: 'BackHorizontalPull', movementPatternPriority: 3, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },

  // Chest
  { name: 'Smith Machine Incline Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestUpper', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'double_plates' },
  { name: 'Incline Dumbell Bench Pres', muscleGroup: 'Chest', movementPattern: 'ChestUpper', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestUpper', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Chest Press Machine', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'stack' },
  { name: 'Barbell Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Dumbell Bench Press', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Chest Dips', muscleGroup: 'Chest', movementPattern: 'ChestMiddle', movementPatternPriority: 3, minimumLiftingExperience: 'none', loadingType: 'plates' },
  { name: 'Pec Deck', muscleGroup: 'Chest', movementPattern: 'ChestFly', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Cable Flye', muscleGroup: 'Chest', movementPattern: 'ChestFly', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Dumbell Flye', muscleGroup: 'Chest', movementPattern: 'ChestFly', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },

  // Rear Delts
  { name: 'Reverse Pec Deck', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsReverseFly', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Dumbell Rear Delt Flye', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsReverseFly', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Machine Rear Delt Row', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsRow', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Seal Row', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsRow', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
  { name: 'Cable Rear Delt Row', muscleGroup: 'RearDelts', movementPattern: 'RearDeltsRow', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'stack' },

  // Side Delts
  { name: 'Dumbell Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellLateralRaise', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Machine Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellLateralRaise', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Lying Dumbell Side Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellIsolatedLateralRaise', movementPatternPriority: 0, minimumLiftingExperience: 'intermediate', loadingType: 'dumbbell' },
  { name: 'Bench Supported Dumbell Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsDumbellIsolatedLateralRaise', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'dumbbell' },
  { name: 'Cable Lateral Raise', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsCableLateralRaise', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Behind the Back Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsCableLateralRaise', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Leaning Cable Lateral Raises', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsCableLateralRaise', movementPatternPriority: 2, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Shoulder Machine Press', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsPress', movementPatternPriority: 0, minimumLiftingExperience: 'none', loadingType: 'stack' },
  { name: 'Barbell Strict Press', muscleGroup: 'SideDelts', movementPattern: 'SideDeltsPress', movementPatternPriority: 1, minimumLiftingExperience: 'none', loadingType: 'double_plates' },
] as const
