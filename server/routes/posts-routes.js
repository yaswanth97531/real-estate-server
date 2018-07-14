const router = require('express').Router();
const cloudinary = require('cloudinary');

router.get('/getPosts', (req, res) => {
  console.log('In get posts api');
  cloudinary.v2.api.resources({
    type: 'upload',
    folder: 'images'
  }, function (error, result) {
    if(error){
      res.send(error);
    }
    res.status(200).json(result);
  });
});

router.post('/postImage', (req, res) => {
  cloudinary.v2.uploader.upload('http://www.gstatic.com/webp/gallery/2.jpg', {
      folder: 'images'
    },
    function (error, result) {
      if(error) {
        res.status(404).send(error)
      }
      res.status(200).send(result.resources);
    });
});

module.exports = router;