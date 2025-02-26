import TaskPriorityWidget from '@src/components/Widgets/MyTasksWidget'
import React from 'react'

const AppDashboard = () => {
  return (
    <div className="p-4">
      <TaskPriorityWidget tasks={[]} initialVisibleCount={3} />
    </div>
  )
}

export default AppDashboard
