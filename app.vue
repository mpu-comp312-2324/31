<template>
  <div class="app">
    <h1>Stocktaking List</h1>
    <div class="add-product">
      <input v-model="newProduct.description" placeholder="Description" />
      <input v-model.number="newProduct.maxStock" placeholder="Max Stock" type="number" />
      <input v-model.number="newProduct.currentStock" placeholder="Current Stock" type="number" />
      <button @click="addProduct">Add Product</button>
    </div>
    <div class="sort-buttons">
      <button @click="sortList('description')">Sort by Description</button>
      <button @click="sortList('currentStock')">Sort by Current Stock</button>
    </div>
    <ul class="product-list">
      <li v-for="product in stocktakingList" :key="product.pk">
        <div class="product-info">
          <span>Description: {{ product.description }}</span>
          <span>Max Stock: {{ product.maxStock }}</span>
          <span>Current Stock: {{ product.currentStock }}</span>
          <span v-if="product.currentStock < product.maxStock * 0.05" class="low-stock">Low Stock</span>
        </div>
        <button @click="deleteProduct(product.pk)">Delete</button>
      </li>
    </ul>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stocktakingList: [],
      newProduct: {
        description: '',
        maxStock: 0,
        currentStock: 0
      },
      errorMessage: ''
    };
  },
  created() {
    this.fetchStocktakingList();
  },
  methods: {
    async fetchStocktakingList() {
      try {
        const response = await fetch('/stocktaking-list');
        if (!response.ok) {
          throw new Error('Failed to fetch stocktaking list');
        }
        this.stocktakingList = await response.json();
      } catch (error) {
        this.errorMessage = 'Error: Failed to fetch stocktaking list';
      }
    },
    async addProduct() {
      try {
        const response = await fetch('/stocktaking-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newProduct)
        });
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
        const newProduct = await response.json();
        this.stocktakingList.push(newProduct);
        this.newProduct = {
          description: '',
          maxStock: 0,
          currentStock: 0
        };
      } catch (error) {
        this.errorMessage = 'Error: Failed to add product';
      }
    },
    async deleteProduct(productId) {
      try {
        const response = await fetch(`/stocktaking-list/${productId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        this.stocktakingList = this.stocktakingList.filter(
          (product) => product.pk !== productId
        );
      } catch (error) {
        this.errorMessage = 'Error: Failed to delete product';
      }
    },
    sortList(sortBy) {
      this.stocktakingList.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
    }
  }
};
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.add-product input {
  margin-right: 10px;
}

.sort-buttons button {
  margin-right: 10px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.low-stock {
  color: red;
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
