import Rive from '@rive-app/react-canvas'
import { Layout, Fit } from '@rive-app/canvas'

const Relayer = () => {
  return (
    <Rive
      src="/assets/relayer.riv"
      layout={
        new Layout({
          fit: Fit.Contain
        })
      }
    />
  )
}

export default Relayer
