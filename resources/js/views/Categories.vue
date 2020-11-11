<template>
  <div class="container-fluid">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/home">Dashboard</router-link>
      </li>
      <li class="breadcrumb-item active">Categories</li>
    </ol>

    <div class="card mb-3">
      <div class="card-header d-flex">
        <span>
          <i class="fas fa-chart-area"></i>
          Categories Management
        </span>
        <button
          class="btn btn-primary btn-sm ml-auto"
          v-on:click="createNewCategory"
        >
          <span class="fa fa-plus"></span> Create New
        </button>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Image</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categories" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ category.name }}</td>
              <td>
                <img
                  :src="`${$store.state.serverPath}/storage/${category.image}`"
                  :alt="category.name"
                  class="table-image"
                />
              </td>
              <td>
                <button
                  class="btn btn-primary btn-sm"
                  v-on:click="editCategory(category)"
                >
                  <span class="fa fa-edit"></span>
                </button>
                <!-- added deleteCategory method in below button click -->
                <button
                  class="btn btn-danger btn-sm"
                  v-on:click="deleteCategory(category)"
                >
                  <span class="fa fa-trash"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal ref="newCategoryModal" hide-footer :title="modalTitle">
      <div class="d-block">
        <form v-on:submit.prevent="createCategory">
          <div class="form-group">
            <label for="name">Enter Name</label>
            <input
              type="text"
              v-model="categoryData.name"
              class="form-control"
              id="name"
              placeholder="Enter category name"
              :class="{ 'is-invalid': errors.name }"
            />
            <div v-if="errors.name" class="invalid-feedback d-block">
              {{ errors.name[0] }}
            </div>
          </div>
          <div class="form-group">
            <label for="image">Choose an image</label>
            <div v-if="categoryData.image.name">
              <img
                src=""
                ref="newCategoryImageDispaly"
                class="rounded-circle"
                style="width: 100px"
              />
            </div>
            <div v-if="categoryData.image != '' && !categoryData.image.name">
              <img
                :src="`${$store.state.serverPath}/storage/${categoryData.image}`"
                alt=""
                class="rounded-circle"
                style="width: 100px"
              />
            </div>
            <input
              type="file"
              v-on:change="attachImage"
              ref="newCategoryImage"
              class="form-control m-1"
              id="image"
              :class="{ 'is-invalid': errors.name }"
            />
            <div class="invalid-feedback d-block" v-if="errors.image">
              {{ errors.image[0] }}
            </div>
          </div>

          <hr />
          <div class="text-right">
            <button
              type="button"
              class="btn btn-default"
              v-on:click="hideNewCategoryModal"
            >
              Cancel
            </button>
            <button type="sumbit" class="btn btn-primary">
              <span class="fa fa-check"></span> Save
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import * as categoryService from "../services/category_service";

export default {
  name: "category",
  data() {
    return {
      categories: [],
      categoryData: {
        name: "",
        image: "",
      },
      editCategoryData: {},

      errors: {},
      edit: false,
      editId: null,
      modalTitle: "Modal Title",
    };
  },
  mounted() {
    this.loadCategories();
  },
  methods: {
    resetForm() {
      this.categoryData = {
        name: "",
        image: "",
      };
    },
    createNewCategory() {
      this.edit = false;
      this.resetForm();
      this.showNewCategoryModal();
    },
    loadCategories: async function () {
      try {
        const response = await categoryService.loadCategories();
        this.categories = response.data.data;
      } catch (error) {
        this.flashMessage.error({
          message: "Some error occurred, Please refresh!",
          time: 5000,
        });
      }
    },
    attachImage() {
      this.categoryData.image = this.$refs.newCategoryImage.files[0];
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.$refs.newCategoryImageDispaly.src = reader.result;
        }.bind(this),
        false
      );

      reader.readAsDataURL(this.categoryData.image);
    },
    hideNewCategoryModal() {
      this.$refs.newCategoryModal.hide();
      this.resetForm();
    },
    showNewCategoryModal() {
      if (this.edit) {
        this.modalTitle = "Edit Category";
      } else {
        this.modalTitle = "Add New Category";
      }
      this.$refs.newCategoryModal.show();
    },
    createCategory: async function () {
      let formData = new FormData();
      formData.append("name", this.categoryData.name);
      formData.append("image", this.categoryData.image);
      if (this.edit) {
        formData.append("_method", "put");
        try {
          const response = await categoryService.updateCategory(
            this.editId,
            formData
          );
          this.loadCategories();
          this.hideNewCategoryModal();
          this.flashMessage.success({
            message: "Category update successfully!",
            time: 5000,
          });
        } catch (error) {
          switch (error.response.status) {
            case 422:
              this.errors = error.response.data.errors;
              break;
            default:
              this.flashMessage.error({
                message: "Some error occurred, Please try again!",
                time: 5000,
              });
              break;
          }
        }
      } else {
        try {
          const response = await categoryService.createCategory(formData);
          this.loadCategories();
          this.hideNewCategoryModal();
          this.flashMessage.success({
            message: "Category stored successfully!",
            time: 5000,
          });
        } catch (error) {
          switch (error.response.status) {
            case 422:
              this.errors = error.response.data.errors;
              break;
            default:
              this.flashMessage.error({
                message: "Some error occurred, Please try again!",
                time: 5000,
              });
              break;
          }
        }
      }
      this.resetForm();
    },
    editCategory: async function (category) {
      try {
        const response = await categoryService.getCategory(category.id);
        if (response) {
          this.edit = true;
          this.editId = response.data.id;
          this.categoryData.name = response.data.name;
          this.categoryData.image = response.data.image;
          this.showNewCategoryModal();
        }
      } catch (error) {
        this.flashMessage.error({
          message: error.response.data.message,
          time: 5000,
        });
      }
    },
    deleteCategory: async function (category) {
      if (!window.confirm(`Are you sure you want to delete ${category.name}`)) {
        return;
      }

      try {
        await categoryService.deleteCategory(category.id);

        this.categories = this.categories.filter((obj) => {
          return obj.id != category.id;
        });

        this.flashMessage.success({
          message: "Category deleted successfully!",
          time: 5000,
        });
      } catch (error) {
        this.flashMessage.error({
          message: error.response.data.message,
          time: 5000,
        });
      }
    },
  },
};
</script>