// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {Router} from 'express';
const router = Router();
import {albumsData} from '../data/index.js';
import validation from '../helpers.js';
router
  .route('/:bandId')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.bandId = validation.checkId(req.params.bandId, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const albumList = await albumsData.getAll(req.params.bandId);
      if(albumList.length==0){ throw 'no albums for the bandId found'}
      return res.status(200).json(albumList);
    } catch (e) {
      res.status(404).json({error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const blogalbums = req.body;
    if (!blogalbums || Object.keys(blogalbums).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      req.params.bandId = validation.checkId(req.params.bandId, 'ID url param');
      if(!blogalbums.title|| !blogalbums.releaseDate|| !blogalbums.tracks){ throw `All fields need to have valid values`}
      blogalbums.title = validation.checkString(blogalbums.title, 'Title');
      blogalbums.releaseDate = validation.checkString(blogalbums.releaseDate, 'Release Date');
      blogalbums.tracks = validation.checkStringArray(blogalbums.tracks, 'Tracks');
      if (blogalbums.tracks.length < 3) { throw `all elements must be strings as well, but there must be AT LEAST 3`;}
      if (!/^(0[1-9]|1[0-2])\/(0[1-9]|(1|2)\d|3[01])\/(19\d{2}|20([0-1]\d|[2][0-4]))$/g.test(blogalbums.releaseDate)) throw 'Invalid date';
      if (typeof blogalbums.rating!== 'number' || blogalbums.rating < 1 || blogalbums.rating > 5 ||(Math.floor(blogalbums.rating * 10) !== blogalbums.rating * 10)){ throw `rating must be a number between 1 and 5 and float with only one decimal place is allowed`}
    } catch (e) {
      return res.status(400).json({error: `${e}`});
    }
    try {
      const { title, releaseDate, tracks, rating} = blogalbums;
      const newAlbum = await albumsData.create(req.params.bandId, title, releaseDate, tracks, rating);
      res.status(200).json(newAlbum);
    } catch (e) {
      res.status(404).json({error: `${e}`});
    }
  });

router
  .route('/album/:albumId')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.albumId = validation.checkId(req.params.albumId, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const album = await albumsData.get(req.params.albumId);
      res.status(200).json(album);
    } catch (e) {
      res.status(404).json({error: `${e}`});
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.albumId = validation.checkId(req.params.albumId, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let deletedAlbum = await albumsData.remove(req.params.albumId);
      res.status(200).json(deletedAlbum);
    } catch (e) {
      res.status(404).json({error: `${e}`});
    }
  });
  export default router;