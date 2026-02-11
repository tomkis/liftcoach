# Workout Progression

Week 0 of every mesocycle determines appropriate working weights for each exercise through loading or testing, followed by calibration:

## Loading

First encounter with an exercise. The app has no prior data for the user on this exercise. The user performs a single set at a self-selected weight, reports the reps completed and whether they reached failure.

## Testing

Returning to an exercise in a new mesocycle. The app already has a loading set from a previous mesocycle. It pre-calculates a suggested testing weight and presents it to the user. The user performs a set at that weight and reports reps completed.

## Calibration

Once loading or testing is complete, the app generates calibration sets to verify the estimated working weight. Both paths funnel into `generateCalibrationSets` which:

1. Estimates 1RM from the performed set using the Epley formula
2. Calculates a target weight via RPE chart lookup — RPE 7 (loading, reached failure), RPE 8 (loading, no failure), or RPE 8 (testing)
3. Generates N pending sets at that weight for 10 reps

The user performs these calibration sets. Their performance feeds into the progression system for subsequent weeks.
