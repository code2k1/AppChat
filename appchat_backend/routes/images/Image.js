const epxress = require("express");
const verifyToken = require("../../middleware/auth");

const fs = require("fs");
const until = require("util");
// const unlinkFile = until.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// const upload = multer();

const { uploadFile, getFileStream } = require("../../config/s3");

const routerImage = epxress.Router();

routerImage.get("/:key", verifyToken, async (req, res) => {
  try {
    const key = req.params.key;
    const readStream = await getFileStream(key);

    // console.log(key);

    // readStream.pipe(res);
  } catch (error) {
    res.status(401).send(error);
  }
});

routerImage.post("/", upload.any("image"), verifyToken, async (req, res) => {
  try {
    const file = req.files;
    // console.log(file);
    let arrayFile = ([] = await Promise.all(
      file.map(async (course) => {
        const result = await uploadFile(course, course.mimetype);
        // const typeFile = course.originalname.split(".");
        return {
          imagePath: `https://appchat-dev.s3.ap-southeast-1.amazonaws.com/${result.Key}`,
          type_message: {
            // type: typeFile[typeFile.length - 1],
            type: "files",
            name: course.originalname,
            size: course.size,
          },
        };
      })
    ));
    res.status(201).send({ path: arrayFile });
  } catch (error) {
    console.log(error);
  }
});

routerImage.post("/imageMobie", verifyToken, async (req, res) => {
  try {
    const { files } = req.body;
    console.log(files.listImageChoose);
    let arrayFile = ([] = await Promise.all(
      files.listImageChoose.map(async (course) => {
        const result = await uploadFile(course, course.mimetype);
        // const typeFile = course.originalname.split(".");
        // return {
        //   imagePath: `https://appchat-dev.s3.ap-southeast-1.amazonaws.com/${result.Key}`,
        //   type_message: {
        //     type: typeFile[typeFile.length - 1],
        //     name: course.originalname,
        //     size: course.size,
        //   },
        // };
      })
    ));
    res.status(201).send({ path: arrayFile });
  } catch (error) {
    console.log(error);
  }
});

module.exports = routerImage;
