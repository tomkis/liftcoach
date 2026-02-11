import { StyleSheet, Text } from 'react-native'

import { HomeTestingMuscleGroup, ProgressionSchema } from '@/mobile/ui/home-testing/types'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.newUi.primary.main,
  },
})

export const progression: ProgressionSchema[] = [
  {
    title: 'Front Legs',
    muscleGroup: HomeTestingMuscleGroup.FrontLegs,
    exercises: [
      {
        exercise: 'Bodyweight Squats',
        intro: (
          <>
            We will start with a simple <Text style={styles.emphasized}>Bodyweight Squat</Text> test to assess your
            current strength level.
          </>
        ),
        technique:
          'Stand with feet shoulder-width apart, lower your body as if sitting back into a chair, keeping your chest up and knees behind your toes.',
        next: 'Since you seem to handle Bodyweight Squats well, lets check your strength with single leg exercise.',
      },
      {
        exercise: 'Bulgarian Split Squat',
        intro: (
          <>
            <Text style={styles.emphasized}>Bulgarian Split Squat</Text> is a true test of your unilateral strength
            which puts more emphasis on both Quads and Glutes.
          </>
        ),
        technique:
          'Place one foot behind you on an elevated surface, lower your body until your back knee nearly touches the ground, then push back up.',
        next: 'Your unilateral strengh seems to be really on-track. Let us move on to something really challenging.',
      },
      {
        exercise: 'Sissy Squat',
        intro: (
          <>
            <Text style={styles.emphasized}>Sissy Squat</Text> is really hard body weight exercise, being able to do
            couple reps will rocket you into some really advanced level of a lifter.
          </>
        ),
        technique:
          'Hold onto a support, elevate your heels. Lean back and lower yourself by bending your knees, then push back up.',
        next: `Wow, that's quite some strength in your Quads. Lets do the final test of your Quads.`,
      },
      {
        exercise: 'Pistol Squat',
        intro:
          'Pistol Squat is probably one of the most demanding body weight exercise you can perform. It will really put into test your legs strength and your balance.',
        technique:
          'Stand on one leg, extend the other leg forward, lower your body by bending the standing leg, then push back up to standing.',
        next: '',
      },
    ],
  },
  {
    title: 'Back Legs',
    muscleGroup: HomeTestingMuscleGroup.BackLegs,
    exercises: [
      {
        exercise: 'Glute Bridge',
        intro: (
          <>
            We will start with a simple <Text style={styles.emphasized}>Glute Bridge</Text> test to assess your
            posterior leg strength.
          </>
        ),
        technique:
          'Lie on your back with knees bent, feet flat on the ground, lift your hips up while squeezing your glutes, then lower back down.',
        next: (
          <>
            Since you seem to handle <Text style={styles.emphasized}>Glute Bridge</Text> well, lets check your strength
            with single leg variations.
          </>
        ),
      },
      {
        exercise: 'Single Leg Glute Bridge',
        intro: (
          <>
            <Text style={styles.emphasized}>Single Leg Glute Bridge</Text> tests your unilateral posterior chain
            strength.
          </>
        ),
        technique:
          'Lie on your back with one leg extended, the other bent, lift your hips up using only the bent leg, then lower back down.',
        next: 'Let us add some weight and extend the range of motion a bit.',
      },
      {
        exercise: 'Backpack Loaded Single Leg Hip Thrust',
        intro: (
          <>
            Let use the <Text style={styles.emphasized}>Backpack</Text> now to add extra weight, put as much weight in
            the backpack as possible.
          </>
        ),
        technique:
          'Sit with your upper back against a sofa or sturdy surface and place a backpack on your hip. Extend one leg while keeping the other bent with your foot flat on the floor. Drive through the heel of the bent leg to lift your hips upward until they are fully extended, then slowly lower back down.',
        next: 'You seems to be pretty strong, let us move to something extremly challenging.',
      },
      {
        exercise: 'Nordic Curl',
        intro: (
          <>
            The <Text style={styles.emphasized}>Nordic Curl</Text> is one of the most challenging bodyweight hamstring
            exercises. It requires exceptional posterior chain strength and control to perform properly.
          </>
        ),
        technique:
          'Kneel on a soft surface with your ankles secured under a heavy object or partner. Keep your body straight from knees to head, slowly lower your upper body toward the ground by bending at the knees, then use your hamstrings to pull yourself back up to the starting position.',
        next: '',
      },
    ],
  },
  {
    title: 'Front Upper Body',
    muscleGroup: HomeTestingMuscleGroup.Chest,
    exercises: [
      {
        exercise: 'Knee Push Up',
        intro: (
          <>
            We will start with a simple <Text style={styles.emphasized}>Knee Push Up</Text> test to assess your current
            chest and tricep strength.
          </>
        ),
        technique:
          'Start in a kneeling position with hands on the ground slightly wider than shoulder-width, lower your chest toward the ground by bending your elbows, then push back up to the starting position.',
        next: 'Since you seem to handle Knee Push Ups well, lets check your strength with full push ups.',
      },
      {
        exercise: 'Push Up',
        intro: (
          <>
            <Text style={styles.emphasized}>Push Up</Text> is a fundamental bodyweight exercise that tests your chest,
            shoulders, and tricep strength with full body tension.
          </>
        ),
        technique:
          'Start in a plank position with hands slightly wider than shoulder-width, lower your body by bending your elbows until your chest nearly touches the ground, then push back up to the starting position.',
        next: 'Your push up strength seems solid. Let us add some weight to make it more challenging.',
      },
      {
        exercise: 'Backpack Loaded Push Up',
        intro: (
          <>
            Let use the <Text style={styles.emphasized}>Backpack</Text> now to add extra weight to your push ups. Put as
            much weight in the backpack as possible while maintaining good form.
          </>
        ),
        technique:
          'Wear a loaded backpack while performing push ups. Start in a plank position with the backpack secured, lower your body by bending your elbows, then push back up while maintaining the added weight.',
        next: 'You seem to handle weighted push ups well. Let us make it even more challenging with an elevated position.',
      },
      {
        exercise: 'Decline Backpack Loaded Push Up',
        intro: (
          <>
            <Text style={styles.emphasized}>Decline Push Ups</Text> with a backpack are extremely challenging as they
            put more emphasis on your upper chest and shoulders while requiring exceptional strength.
          </>
        ),
        technique:
          'Place your feet on an elevated surface (like a chair or sofa) while wearing a loaded backpack. Perform push ups in this declined position, which increases the difficulty and targets your upper chest more effectively.',
        next: '',
      },
    ],
  },
  {
    title: 'Back Upper Body',
    muscleGroup: HomeTestingMuscleGroup.Back,
    exercises: [
      {
        exercise: 'Lying Towel Row',
        intro: (
          <>
            We will start with a simple <Text style={styles.emphasized}>Lying Towel Row</Text> test to assess your
            current back strength and pulling ability.
          </>
        ),
        technique:
          'Lie on your back with your arms extended straight in front of your head, holding a towel. Keep your arms off the floor and pull the towel toward your chest using your back muscles, then slowly lower your arms back to the starting position.',
        next: 'Since you seem to handle Lying Towel Rows well, lets see how you perform with some added weight.',
      },
      {
        exercise: 'Backpack Loaded Single Arm Row',
        intro: (
          <>
            <Text style={styles.emphasized}>Single Arm Rows</Text> with a backpack will test your unilateral back
            strength.
          </>
        ),
        technique:
          'Bend forward at the waist, place one hand on a sturdy surface for support, hold a loaded backpack in the other hand, and pull it up toward your hip while keeping your elbow close to your body.',
        next: 'Your single arm row strength seems solid. Let us move to a more challenging horizontal pulling exercise.',
      },
      {
        exercise: 'Table Inverted Row',
        intro: (
          <>
            <Text style={styles.emphasized}>Table Inverted Rows</Text> are a great bodyweight exercise that mimics the
            movement pattern of a barbell row, testing your overall back strength.
          </>
        ),
        technique:
          'Lie under a sturdy table, grab the edge with both hands, keep your body straight from head to heels, and pull your chest up toward the table edge, then slowly lower back down.',
        next: 'You seem to handle Table Inverted Rows well. Let us add some weight to make it more challenging.',
      },
      {
        exercise: 'Backpack Loaded Table Inverted Row',
        intro: (
          <>
            <Text style={styles.emphasized}>Weighted Inverted Rows</Text> with a backpack are challenging as they
            require exceptional back strength while maintaining proper form under load.
          </>
        ),
        technique:
          'Wear a loaded backpack while performing table inverted rows. Lie under a sturdy table, grab the edge with both hands, keep your body straight, and pull your chest up toward the table edge while supporting the additional weight.',
        next: '',
      },
    ],
  },
] as const
