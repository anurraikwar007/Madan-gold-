import goldChain1 from "../assets/images/products/gold/chains/gold-chain-1.webp";
import goldChain2 from "../assets/images/products/gold/chains/gold-chain-2.webp";

import goldRing1 from "../assets/images/products/gold/rings/gold-ring-1.webp";
import goldRing2 from "../assets/images/products/gold/rings/gold-ring-2.webp";

import goldEaring1 from "../assets/images/products/gold/earrings/gold-earing-1.webp";

import platinumRing1 from "../assets/images/products/platinum/rings/platenium-ring-1.webp";

import platinumEaring1 from "../assets/images/products/platinum/earrings/platinum-earing-1.webp";

import silverAnkel1 from "../assets/images/products/silver/anklets/silver-ankel-1.webp";

import silverNeckless1 from "../assets/images/products/silver/chains/silver-neckless-1.webp";

export const products = [

  {
    id: 1,

    name: "Royal Gold Chain",

    category: "chains",

    metal: "gold",

    price: 45999,

    image: goldChain1,

    hoverImage: goldChain2,

    bestseller: true,

    newLaunch: false,
  },

  {
    id: 2,

    name: "Luxury Gold Ring",

    category: "rings",

    metal: "gold",

    price: 22999,

    image: goldRing1,

    hoverImage: goldRing2,

    bestseller: true,

    newLaunch: true,
  },

  {
    id: 3,

    name: "Classic Gold Earing",

    category: "earrings",

    metal: "gold",

    price: 18999,

    image: goldEaring1,

    hoverImage: goldEaring1,

    bestseller: false,

    newLaunch: true,
  },

  {
    id: 4,

    name: "Platinum Ring",

    category: "rings",

    metal: "platinum",

    price: 55999,

    image: platinumRing1,

    hoverImage: platinumRing1,

    bestseller: true,

    newLaunch: false,
  },

  {
    id: 5,

    name: "Luxury Platinum Earing",

    category: "earrings",

    metal: "platinum",

    price: 32999,

    image: platinumEaring1,

    hoverImage: platinumEaring1,

    bestseller: false,

    newLaunch: true,
  },

  {
    id: 6,

    name: "Silver Ankel",

    category: "anklets",

    metal: "silver",

    price: 4999,

    image: silverAnkel1,

    hoverImage: silverAnkel1,

    bestseller: true,

    newLaunch: false,
  },

  {
    id: 7,

    name: "Silver Neckless",

    category: "chains",

    metal: "silver",

    price: 8999,

    image: silverNeckless1,

    hoverImage: silverNeckless1,

    bestseller: false,

    newLaunch: true,
  },

];