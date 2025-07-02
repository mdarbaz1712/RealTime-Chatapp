import {v2 as cloudinary} from "cloudinary"

import {config} from "dotenv"

config()

cloudinary.config({
    cloud_name:process.env.Cloudinary_Name,
    api_key:process.env.Cloudinary_api_key,
    api_secret:process.env.Cloudinary_api_secret
})

export default cloudinary

