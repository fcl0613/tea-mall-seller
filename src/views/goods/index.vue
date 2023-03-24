<template>
  <div class="container">
    <div class="search-area">
      <div class="header">
        <div class="left">
          <i class="el-icon-search"></i>
          查询搜索
        </div>
        <div class="right">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="getGoodsList">搜索</el-button>
          <el-button type="primary" @click="toAddGoodsPage">新增</el-button>
        </div>
      </div>
      <div class="search-form">
        <el-form ref="form" :model="searchForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              ref="categoryCascader"
              :options="categoryOptions"
              :show-all-levels="false"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select v-model="searchForm.goodsStatus" placeholder="请选择">
              <el-option
                v-for="item in goodsStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="data-area">
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名" width="150">
        </el-table-column>
        <el-table-column label="商品图片" width="250">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="baseImageUrl + scope.row.goodsCover"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="180">
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.goodsStatus"
              :active-value="1"
              :inactive-value="0"
              @change="updateStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="updateStock(scope.row.id)"
              >库存</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="toUpdatePage(scope.row.id)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteGoods(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-area">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog title="库存修改" :visible.sync="dialogFormVisible">
      <el-form :model="stockForm">
        <el-form-item label="库存数量" label-width="100px">
          <el-input v-model="stockForm.stock" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="subStock"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods'
import categoryApi from '@/api/category'
import baseImageUrl from '@/utils/baseImageUrl'
export default {
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
      },
      goodsStatusOptions: [
        { label: '下架', value: 0 },
        { label: '上架', value: 1 },
      ],
      categoryOptions: [
        {
          label: '绿茶',
          value: 0,
          children: [
            { label: '龙井', value: 1 },
            { label: '毛尖', value: 2 },
          ],
        },
      ],
      goodsList: [],
      total: 0,
      baseImageUrl: baseImageUrl.BASE_IMG_URL,
      dialogFormVisible: false,
      currentId: 0,
      stockForm: {}
    }
  },
  created() {
    this.getAllCategory()
    this.getGoodsList()
  },
  methods: {
    handleChange(val) {
      console.log(val)
      this.searchForm.categoryId = val[1]
    },
    updateStock(id) {
      this.currentId = id
      this.dialogFormVisible = !this.dialogFormVisible
    },
    toUpdatePage(id) {
      this.$router.push({
        path: '/updateGoods',
        query: {
          goodsId: id
        }
      })
    },
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          goodsApi.deleteGoods(id).then((res) => {
            this.$message.success(res.msg)
            this.getGoodsList()
          })
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.getGoodsList()
    },
    getGoodsList() {
      goodsApi.getGoodsList(this.searchForm).then((res) => {
        this.goodsList = res.data.list
        this.total = res.data.total
      })
    },
    getAllCategory() {
      categoryApi.getAllCategory().then((res) => {
        this.categoryOptions = res.data
      })
    },
    reset() {
      this.searchForm = {
        pageNum: 1,
        pageSize: 10,
      }
      this.getGoodsList()
    },
    updateStatus(row) {
      goodsApi.updateStatus(row.id, row.goodsStatus).then((res) => {
        this.$message.success(res.msg)
      })
    },
    toAddGoodsPage() {
      this.$router.push({
        path: '/addGoods',
      })
    },
    cancel() {
      this.dialogFormVisible = !this.dialogFormVisible
      this.stockForm = {}
    },
    subStock() {
      goodsApi.updateStock(this.currentId, this.stockForm.stock).then((res) => {
        this.$message.success(res.msg)
        this.dialogFormVisible = !this.dialogFormVisible
        this.getGoodsList()
      })
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  .search-area {
    border: 1px solid rgb(214, 214, 214);
    .header {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      margin-left: 6px;
      margin-right: 6px;
    }
    .search-form {
      margin-top: 10px;
      .el-form {
        width: 80%;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .data-area {
    margin-top: 20px;
    border: 1px solid rgb(214, 214, 214);
  }
  .page-area {
    margin-top: 10px;
    float: right;
  }
}
</style>