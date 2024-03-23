// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {Router} from 'express';
const router = Router();
import {bandsData} from '../data/index.js';
import validation from '../helpers.js';
router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const bandList = await bandsData.getAll();
      res.json(bandList);
    } catch (e) {
      res.status(500).json({error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const blogbands = req.body;
    if (!blogbands || Object.keys(blogbands).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      if (!blogbands.name|| !blogbands.genre|| !blogbands.website|| !blogbands.recordCompany|| !blogbands.groupMembers|| !blogbands.yearBandWasFormed) throw 'All fields need to have valid values';
      blogbands.name = validation.checkString(blogbands.name, 'name');
      blogbands.website = validation.checkString(blogbands.website, 'website');
      blogbands.genre = validation.checkStringArray(blogbands.genre, 'genre');
      blogbands.groupMembers = validation.checkStringArray(blogbands.groupMembers, 'groupMembers');
      if(blogbands.genre.length==0 ||blogbands.groupMembers.length==0) throw `must be arrays and must have at least one element in each of them that is a valid string`
      if(typeof blogbands.yearBandWasFormed!=='number' || (blogbands.yearBandWasFormed < 1900 || blogbands.yearBandWasFormed > 2023)) throw 'so only years 1900-2023 are valid values';
      if(!(/^(http:\/\/www\.)[a-zA-Z]{5,}(\.com)$/.test(blogbands.website))){ throw "invalid website format";}
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      const {name, genre, website, recordCompany, groupMembers, yearBandWasFormed} = blogbands;
      const newBand = await bandsData.create(name, genre, website, recordCompany, groupMembers, yearBandWasFormed);
      res.status(200).json(newBand);
    } catch (e) {
      res.status(400).json({error: e});
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const band = await bandsData.get(req.params.id);
      res.status(200).json(band);
    } catch (e) {
      res.status(404).json({error: e});
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({error: `${e}`});
    }
    try {
      let deletedBand = await bandsData.remove(req.params.id);
      res.status(200).json(deletedBand);
    } catch (e) {
      res.status(404).json({error: e});
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }
    try {
      if (!updatedData.name|| !updatedData.genre|| !updatedData.website|| !updatedData.recordCompany|| !updatedData.groupMembers|| !updatedData.yearBandWasFormed) throw 'All fields need to have valid values';
      req.params.id = validation.checkId(req.params.id, 'ID'); 
      updatedData.name = validation.checkString(updatedData.name, 'name');   
      updatedData.website = validation.checkString(updatedData.website, 'website');
      updatedData.recordCompany = validation.checkString(updatedData.recordCompany, 'recordCompany');
      updatedData.genre = validation.checkStringArray(updatedData.genre, 'genre');
      updatedData.groupMembers = validation.checkStringArray(updatedData.groupMembers, 'groupMembers');
      if(updatedData.genre.length==0 ||updatedData.groupMembers.length==0) throw `must be arrays and must have at least one element in each of them that is a valid string`
      if(typeof updatedData.yearBandWasFormed!=='number' || (updatedData.yearBandWasFormed < 1900 || updatedData.yearBandWasFormed > 2023)) throw 'so only years 1900-2023 are valid values';
      if(!(/^(http:\/\/www\.)[a-zA-Z]{5,}(\.com)$/.test(updatedData.website))){ throw "invalid website format";}
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      const updatedband = await bandsData.update(
        req.params.id,
        updatedData.name,
        updatedData.genre,
        updatedData.website,
        updatedData.recordCompany,
        updatedData.groupMembers,
        updatedData.yearBandWasFormed
      );
      res.json(updatedband);
    } catch (e) {
      res.status(404).json({error: `${e}`});
    }
  });
export default router;