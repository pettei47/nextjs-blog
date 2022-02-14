import { NextApiRequest, NextApiResponse } from "next"


//export default function handler(req, res) {
export default (_: NextApiRequest, res: NextApiResponse) => {
	res.status(200).json({ text: 'hello', id: 42 })
}
