import { NTag } from "naive-ui"

const renderUser = (firstName, lastName) => <div>Hello, <NTag>{firstName} {lastName}</NTag></div>
const testVar = 'String'

const testJsx = <div>blabla {true ? 'Haha' : 'No'}</div>

export const contentItem = ({ $root }) => <testJsx/>