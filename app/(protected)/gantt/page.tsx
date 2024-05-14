import GanttChart from '@/src/components/Syncfusion/gantt'

const GanttPage = () => {
  return (
    <div className="flex flex-col">
      <span style={{ fontSize: 20 }} className="font-bold">
        Gantt Chart
      </span>
      <GanttChart />
    </div>
  )
}

export default GanttPage
