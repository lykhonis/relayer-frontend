import Rive from '@rive-app/react-canvas'
import { Layout, Fit } from '@rive-app/canvas'

const Loading = () => {
  return (
    <div className="max-w-3xl mx-auto flex items-center content-center justify-center lg:max-w-7xl lg:px-8">
      <Rive
        style={{ height: '400px' }}
        src="/assets/jump-man.riv"
        layout={
          new Layout({
            fit: Fit.FitHeight
          })
        }
      />
    </div>
  )
}

export default Loading
