/**
 * Node Modules
 */
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);


/**
 * Model imports.
 */
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Bid = require("../../models/bid.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

/**
 * Declations
 */
const DOMAIN = 'http://localhost:3000';

/**
 * @description - Creates a payment session
 */
module.exports.createPayment = catchAsync(async (req, res) => {

    const { id: productId } = req.params;
    const product = await Product.findById(productId);

    const { _id, title: name, description, currentHighestBid, images, user: seller } = product;
    const { amount, bid, user: bidder } = currentHighestBid;

    const chekoutProduct = await stripe.products.create({
        name,
        description,
        images: images.map(image => image.path),
        metadata: {
            'product_id': `${_id}`,
            'seller_id': `${seller}`,
            'bidder_id': `${bidder}`,
            'bid_id': `${bid}`
        }
    });

    const price = await stripe.prices.create({
        // unit_amount: amount * 100,
        unit_amount: 100,
        currency: 'inr',
        product: chekoutProduct.id,
    });

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: price.id,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${DOMAIN}/stripe/success`,
        cancel_url: `${DOMAIN}/stripe/cancel`,
    });

    res.redirect(303, session.url);
});