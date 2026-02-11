import { LiftingExperience, MicrocycleWorkoutsTemplate, MicrocycleWorkoutsTemplateWithExercises } from '../../index'

export interface IExercisePicker {
  pickExercises(
    microcycleTemplate: MicrocycleWorkoutsTemplate,
    experience: LiftingExperience
  ): Promise<MicrocycleWorkoutsTemplateWithExercises>
}
