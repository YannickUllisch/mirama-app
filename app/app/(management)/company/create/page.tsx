import MaxWidthContainer from '@src/components/Calendar/shadcn-fullcalender-main/components/layout/maxwidthcontainer'
import { newevents } from '@src/components/Calendar/shadcn-fullcalender-main/data/events'
import { calendarConfig } from '@src/components/Calendar/shadcn-fullcalender-main/full-calender-config'
import FullCalender from '@src/components/Calendar/shadcn-fullcalender-main/shadcn-fullcalender/full-calender'
import React from 'react'

const page = () => {
  return (
    <MaxWidthContainer>
      <section className="py-20 space-y-6">
        <FullCalender events={newevents} config={calendarConfig} />
      </section>
    </MaxWidthContainer>
  )
}

export default page
