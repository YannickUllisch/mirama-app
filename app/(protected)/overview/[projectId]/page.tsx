import React, { type FC } from 'react'

const ProjectPage: FC<{ params: { [key: string]: string | string[] } }> = ({
  params,
}) => {
  return <div>{params.projectId}</div>
}

export default ProjectPage
