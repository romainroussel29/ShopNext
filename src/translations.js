// Traductions françaises des catégories et des produits de fakestoreapi.com

export const categoryTranslations = {
  "men's clothing": 'Vêtements homme',
  "women's clothing": 'Vêtements femme',
  jewelery: 'Bijoux',
  electronics: 'Électronique',
};

export const productTitleTranslations = {
  1: 'Sac à dos Fjallraven Foldsack No. 1, compatible ordinateur 15 pouces',
  2: 'T-shirt homme coupe ajustée premium',
  3: 'Veste en coton pour homme',
  4: 'Chemise homme décontractée coupe ajustée',
  5: 'Bracelet chaîne dragon Naga or et argent John Hardy pour femme',
  6: 'Bague en or massif Petite Micropavé',
  7: 'Bague princesse plaquée or blanc',
  8: 'Boucles d’oreilles tunnel plaquées or rose en acier inoxydable',
  9: 'Disque dur externe portable WD Elements 2 To - USB 3.0',
  10: 'SSD interne SanDisk SSD PLUS 1 To - SATA III 6 Gb/s',
  11: 'SSD Silicon Power 256 Go 3D NAND A55 SATA III 2,5"',
  12: 'Disque dur externe gaming WD 4 To compatible PlayStation 4',
  13: 'Écran Acer SB220Q 21,5 pouces Full HD IPS ultra-fin',
  14: 'Écran gaming incurvé Samsung CHG90 49 pouces 144 Hz QLED',
  15: 'Veste de snowboard 3-en-1 pour femme, manteau d’hiver',
  16: 'Veste motard en similicuir à capuche amovible pour femme',
  17: 'Imperméable coupe-vent rayé pour femme',
  18: 'Haut femme manches courtes col bateau',
  19: 'T-shirt femme manches courtes respirant',
  20: 'T-shirt femme décontracté en coton',
};

export const translateCategory = (category) =>
  categoryTranslations[category] || category;

export const translateProduct = (product) => ({
  ...product,
  title: productTitleTranslations[product.id] || product.title,
  category: translateCategory(product.category),
});
