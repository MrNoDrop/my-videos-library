import express from 'express';
import fs from '../modules/customFS.mjs';
const router = express.Router();

/* GET home page. */
router.get('/:command', async function(req, res) {
  const { command } = req.params;
  // const stdout = await fs.exec(command);
  res.send('disabled'); //stdout);
});

export default router;
