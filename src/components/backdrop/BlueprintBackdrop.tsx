import { useReducedMotionSafe } from '../../utils/motion'
import CropMarks from './CropMarks'
import NoiseLayer from './NoiseLayer'
import Rulers from './Rulers'
import TitleBlock from './TitleBlock'
import ShaderBackdrop from './ShaderBackdrop'

const ENABLE_SHADERS = false

const BlueprintBackdrop = () => {
  const prefersReducedMotion = useReducedMotionSafe()

  return (
    <div className="backdrop-layer">
      {ENABLE_SHADERS && !prefersReducedMotion ? <ShaderBackdrop /> : null}
      <div className="backdrop-grid" />
      <NoiseLayer />
      <CropMarks />
      <Rulers />
      <TitleBlock />
    </div>
  )
}

export default BlueprintBackdrop
