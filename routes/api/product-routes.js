const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
// The `/api/products` endpoint
router.get('/', async (req, res) => {
  try {
    const dbProductData = await Product.findAll({
      attributes: [
        'id',
        'product_name',
        'price',
        'stock',
        'category_id'
      ],
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
        }
      ]
    });
    res.json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dbProductData = await Product.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'product_name',
        'price',
        'stock',
        'category_id'
      ],
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
        }
      ]
    });
    res.json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    // if product tags exist, we need to create new pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArray = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArray);
      res.status(200).json(productTagIds);
    } else {
      // if no product tags, just respond
      res.status(200).json(product);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // find out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    // run both actions
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    res.json(updatedProductTags);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dbProductData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!dbProductData) {
      return res.status(404).json({ message: 'Product does not exist' });
    }
    res.json(dbProductData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
