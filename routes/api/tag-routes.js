const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
// The `/api/tags` endpoint
router.get('/', async (req, res) => {
  try {
    const dbTagData = await Tag.findAll({
      attributes: [
        'id',
        'tag_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        }
      ]
    });
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dbTagData = await Tag.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'tag_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
        }
      ]
    });
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const dbTagData = await Tag.update({
      tag_name: req.body.tag_name
    }, {
      where: {
        id: req.params.id
      }
    });
    if (!dbTagData) {
      res.status(404).json({ message: 'Tag no available / Not found' });
      return;
    }
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dbTagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!dbTagData) {
      res.status(404).json({ message: 'Tag no available / Not found' });
      return;
    }
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
