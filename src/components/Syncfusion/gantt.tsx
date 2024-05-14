import { GanttComponent, Inject, Selection } from '@syncfusion/ej2-react-gantt'

const _dataSource = [
  {
    TaskID: 1,
    TaskName: 'Task 1',
    StartDate: new Date('02/03/2022'),
    Duration: 5,
  },
  // Add more tasks as needed
]

const _taskFields = {
  id: 'TaskID',
  name: 'TaskName',
  startDate: 'StartDate',
  duration: 'Duration',
}

const GanttChart = () => {
  return (
    <div> yo</div>
    // <GanttComponent dataSource={dataSource} taskFields={taskFields}>
    //   <Inject services={[Selection]} />
    // </GanttComponent>
  )
}

export default GanttChart
