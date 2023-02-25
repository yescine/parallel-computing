import  async from "async";
import axios from "axios"
import fs from 'fs'
const urls = Array.from(Array(200).keys()).map(key=>`https://dummyjson.com/products/${key+1}`)

async.mapLimit(urls, 50, async function(url:string) {
    const response = await axios(url)
    console.log(response.data.title)
    return response.data
}, (err, results) => {
    if (err) throw err
    // results is now an array of the response bodies
    console.log(results)
    fs.writeFileSync('./data.json',JSON.stringify(results))
})