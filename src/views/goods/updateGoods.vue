<template>
  <div class="container">
    <el-card>
      <el-form
        :model="dataForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="dataForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品封面" prop="goodsCover">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="coverUpload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
          >
            <img
              v-if="coverUrl"
              :src="baseImageUrl + coverUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品副标题" prop="subtitle">
          <el-input v-model="dataForm.subtitle"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="dataForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input v-model.number="dataForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-cascader
            v-model="categoryValue"
            :options="categoryOptions"
            ref="cascader"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品状态" prop="goodsStatus">
          <el-switch
            v-model="dataForm.goodsStatus"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="商品展示图">
          <el-upload
            action=""
            :before-upload="handleShowPreview"
            :on-remove="handleShowRemove"
            :file-list="showFileList"
            :http-request="showPicUpload"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情">
          <el-upload
            action=""
            :before-upload="handleDetailPreview"
            :on-remove="handleDetailRemove"
            :file-list="detailFileList"
            :http-request="detailPicUpload"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="reback">返回</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="onSubmit">新增商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import goodsApi from '@/api/goods'
import fileUploadApi from '@/api/fileUpload'
import baseImageUrl from '@/utils/baseImageUrl'
import categoryApi from '@/api/category'
export default {
  data() {
    const checkPrice = (rule, value, cb) => {
      const priceReg =
        /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
      if (priceReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的价格'))
    }
    return {
      dataForm: {
        stock: 0,
        goodsStatus: 0,
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        subtitle: [
          { required: true, message: '请输入商品副标题', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' },
        ],
        categoryId: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
      },
      coverUrl: '',
      baseImageUrl: baseImageUrl.BASE_IMG_URL,
      showFileList: [],
      detailFileList: [],
      categoryValue: [],
      categoryOptions: [],
    }
  },
  created() {
    this.getAllCategory()
  },
  methods: {
    reback() {
      this.$router.go(-1)
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.addGoods()
      })
    },
    addGoods() {
      if (this.coverUrl === '') {
        this.$message.error('请先上传封面图片')
      }
      let showFileList = this.showFileList
      if (showFileList.length === 0) {
        this.$message.error('请先上传展示图片')
      }
      let detailFileList = this.detailFileList
      if (detailFileList.length === 0) {
        this.$message.error('请先上传详情图片')
      }
      let showList = []
      for(let i = 0; i < showFileList.length; i++) {
        showList.push(showFileList[i].name)
      }
      let detailList = []
      for(let i = 0; i < detailFileList.length; i++) {
        detailList.push(detailFileList[i].name)
      }
      this.dataForm.goodsShowPic = showList
      this.dataForm.goodsDetails = detailList
      goodsApi.addGoods(this.dataForm).then((res) => {
        this.$message.success(res.msg)
        this.reback()
      })
    },
    handleCoverSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },
    handleShowPreview(file) {
      console.log(file.type)
      const fileType = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'
      if(!fileType) {
        this.$message.error('只能上传jpg和png格式的图片')
        return false
      }
      console.log(this.showFileList.length)
      if(this.showFileList.length > 4) {
        this.$message.error('图片上传数量已达上限')
        return false
      }
    },
    handleShowRemove(file, fileList) {
      console.log('展示图片消除', file, fileList)
      this.showFileList = fileList
    },
    handleDetailPreview(file) {
      console.log(file.type)
      const fileType = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'
      if(!fileType) {
        this.$message.error('只能上传jpg和png格式的图片')
        return false
      }
      if(this.detailFileList.length > 4) {
        this.$message.error('图片上传数量已达上限')
        return false
      }
    },
    handleDetailRemove(file, fileList) {
      console.log('详情图片消除', file, fileList)
      this.detailFileList = fileList
    },
    handleChange(val) {
      console.log(val)
      this.dataForm.categoryParentId = val[0]
      this.dataForm.categoryId = val[1]
    },
    getAllCategory() {
      categoryApi.getAllCategory().then((res) => {
        this.categoryOptions = res.data
      })
    },
    coverUpload(options) {
      let file = options.file
      let formData = new FormData()
      formData.append('file', file)
      fileUploadApi.fileUpload(formData).then((response) => {
        let res = response.data
        if (res.code == 200) {
          console.log(res)
          this.coverUrl = res.data
          this.dataForm.goodsCover = this.coverUrl
          console.log(this.coverUrl)
          this.$message.success('文件上传成功')
        } else {
          this.$message.error('文件上传失败')
        }
      })
    },
    showPicUpload(options) {
      let file = options.file
      let formData = new FormData()
      formData.append('file', file)
      fileUploadApi.fileUpload(formData).then((response) => {
        let res = response.data
        if (res.code == 200) {
          console.log(res)
          let imageName = res.data
          this.showFileList.push({
            uid: imageName.substr(0, imageName.length - 4),
            name: imageName,
            url: this.baseImageUrl + imageName,
          })
          this.$message.success('文件上传成功')
        } else {
          this.$message.error('文件上传失败')
        }
      })
    },
    detailPicUpload(options) {
      let file = options.file
      let formData = new FormData()
      formData.append('file', file)
      fileUploadApi.fileUpload(formData).then((response) => {
        let res = response.data
        if (res.code == 200) {
          console.log(res)
          let imageName = res.data
          this.detailFileList.push({
            uid: imageName.substr(0, imageName.length - 4),
            name: imageName,
            url: this.baseImageUrl + imageName,
          })
          this.$message.success('文件上传成功')
        } else {
          this.$message.error('文件上传失败')
        }
      })
    },
    reset() {
      this.dataForm = {
        stock: 0,
        goodsStatus: 0,
      }
      this.detailFileList = []
      this.showFileList = []
      let _casecader = this.$refs.cascader
      if (_casecader) {
        _casecader.$refs.panel.checkedValue = []
        _casecader.$refs.panel.activePath = []
        _casecader.$refs.panel.syncActivePath()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  .el-card {
    width: 70%;
    .el-form {
      width: 60%;
      margin-left: 150px;
      .avatar-uploader {
        .avatar {
          width: 100px;
          height: 100px;
          display: block;
        }
        .avatar-uploader-icon {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          font-size: 28px;
          color: #8c939d;
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }
      }
    }
  }
}
</style>