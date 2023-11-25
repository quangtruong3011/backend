
const dataQuantity = [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 4 },
];

const existingQuantity = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 1 },
    { id: 3, quantity: 1 },
];

const updatedQuantity = existingQuantity.map(existingItem => {
    const newDataItem = dataQuantity.find(item => item.id === existingItem.id);
    if (newDataItem) {
        return { id: existingItem.id, quantity: existingItem.quantity + newDataItem.quantity };
    }
    return existingItem;
});

console.log(updatedQuantity);
