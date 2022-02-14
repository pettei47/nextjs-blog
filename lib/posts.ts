import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
	//Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory)
	const allPostsData = fileNames.map(fileName => {
		//Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '')

		//Read md file as string
		const fullPath = path.join(postsDirectory, fileName)
		const fileContents = fs.readFileSync(fullPath, 'utf8')

		//Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents)
		const filePath = path.join('posts', id)

		//Conbine the data with the id
		return {
			id,
			filePath,
			...(matterResult.data as { date: string; title: string})
		}
	})
	//Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1
		} else if (a > b) {
			return -1
		} else {
			return 0
		}
	})
	// Instead of the file system,
	// fetch post data from a database
	// <= import someDatabaseSDK from 'someDatabaseSDK'
	// <= const databaseClient = someDatabaseSDK.createClient(...)
	// return databaseClient.query('SELECT posts...')

	// Instead of the file system,
	// fetch post data from an external API endpoint
	// const res = await fetch('..')
	// return res.json()
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory)

	//Returns an array that looks like this
	// [
	// 	{
	// 		params: {
	// 			id: 'ssg-ssr'
	// 		}
	// 	},
	// 	{
	// 		params: {
	// 			id: 'pre-rendering'
	// 		}
	// 	}
	// ]
	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, '')
			}
		}
	})
}

export async function getPostData(id: string) {
	const fullPath = path.join(postsDirectory, `${id}.md`)
	const fileContents = fs.readFileSync(fullPath, 'utf8')

	const matterResult = matter(fileContents)

	//Use remark to convert markdown int HTML string
	const processedContent = await remark()
		.use(html)
		.process(matterResult.content)
	const contentHTML = processedContent.toString()

	return {
		id,
		contentHTML,
		...(matterResult.data as { date: string; title: string})
	}
}
