<!-- Categories.vue -->
<template>
	<div class="container-fluid">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Dashboard</router-link>
        </li>
        <li class="breadcrumb-item active">Categories</li>
      </ol>

      <div class="card mb-3">
            <div class="card-header d-flex">
              <i class="fas fa-chart-area"></i>
              Categories Management
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
                        <tr>
                            <td>1</td>
                            <td>Shirt</td>
                            <td>Image</td>
                            <td>
                                <button class="btn btn-primary btn-sm"><span class="fa fa-edit"></span></button>
                                <button class="btn btn-danger btn-sm"><span class="fa fa-trash"></span></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>