import { hello } from './hello'
import { world } from './world'

let element = document.querySelector<HTMLHeadingElement>('#message')
if (element) element.innerText = `${hello} ${world}`
