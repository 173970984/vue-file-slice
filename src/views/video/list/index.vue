<template>
    <div class="ele-body">
        <el-card shadow="never">
            <!-- 搜索表单 -->


                    <el-upload
                            :http-request="upload"
                            class="upload-demo"
                            action=""
                            :on-change="handleChange"
                            :before-upload="handleBeforeUpload"
                            :on-progress="handleProgress"
                    >
                        <el-button slot="trigger">选取文件</el-button>
                        <!--                            &lt;!&ndash;上传文件按钮&ndash;&gt;-->
                        <!--                            <el-button style="margin-left: 10px" type="primary" :loading="uploading" :disabled="files.length === 0" >-->
                        <!--                                上传文件-->
                        <!--                            </el-button>-->
                        <div class="clearfix"></div>
                        <el-progress :percentage="percent"></el-progress>

                    </el-upload>
                    <div >
                        {{editForm}}
                    </div>



            <div style="text-align: center;font-size: 20px;margin-top: 100px">
                各位老板用爽了可随意打赏，祝老板发财。
                有问题联系：173970984@qq.com
            </div>
            <div style="display: flex;max-width: 680px;margin: 0px auto;background: #fff;">
                <div style="width: 50%;background: #fff"><img style="margin: 20px; max-width: 100%;width: 100%" src="@/assets/a.jpg" /></div>
                <div style="width: 50%;padding-top: 100px;background: #fff"><img style="margin: 20px;max-width: 100%;width: 100%;" src="@/assets/w.jpg" /></div>
            </div>
        </el-card>





    </div>
</template>

<script>
    export default {
        name: "fileupload",
        data() {
            return {
                files: [],  // 选中的文件列表
                uploading: false,  // 是否正在上传
                percent: 0,  // 上传进度
                setting:{
                    baseURL:"http://fileupload.lol/api",
                },
                editForm:{},
                headers:{Authorization:"1"},
            };
        },
        mounted(){
        },
        methods: {
            handleChange(files,fileList) {
                console.log("handleChangehandleChangehandleChangehandleChange")
                console.log(files)
                // 计算文件MD5
                const chunkSize = 2*1024 * 1024; // 每个块的大小为 1MB
                const fileSize =files.raw.size;  // 文件大小
                const chunks = Math.ceil(fileSize / chunkSize);  // 总块数
                let params={
                    file_hash:"060e4e9e30bcb9ae675a80328a87a687",
                }
                this.$http
                    .post(this.setting.baseURL+'/upload/beforeUpload', params)  // 上传块数据
                    .then(res => {
                        console.log("12312313")
                        console.log(res)
                        if(res.data.code==0){
                            this.percent = Math.floor((res.data.data / chunks) * 100);
                        }
                        console.log("已上传结果")
                        console.log(res)
                    })
                    .catch(err => {

                        console.log("eeeeeeeeeeeeeeee")
                        console.log(err)
                    });
            },
            async  upload(param) {
                let file = param.file
                console.log("xxxxxxxxxxxxxxxxxxuploaduploaduploadupload")
                console.log(file)
                try{
                    const chunkSize = 2*1024 * 1024; // 每个块的大小为 1MB
                    const fileSize =file.size;  // 文件大小
                    const chunks = Math.ceil(fileSize / chunkSize);  // 总块数
                    const tasks = [];  // 上传任务数组
                    let uploaded = 0;  // 已上传块数
                    // 文件切割
                    let startCoiunt = 0
                    for (let i = 0; i < chunks; i++) {

                        const start = i * chunkSize;
                        const end = Math.min(start + chunkSize, fileSize);
                        const formData = new FormData();
                        formData.append('chunk_index', i);  // 块编号
                        formData.append('chunk_count', chunks);  // 总块数
                        formData.append('file_id',file.uid);  // 文件ID
                        formData.append('file_hash',"060e4e9e30bcb9ae675a80328a87a687");  // 文件ID
                        formData.append('file',file.slice(start, end));  // 块数据
                        formData.append('file_size',file.slice(start, end).size);  // 块数据
                        formData.append('file_name',file.name);  // 块数据

                        this.$http
                            .post(this.setting.baseURL+'/upload/index', formData)  // 上传块数据
                            .then(res => {
                                console.log("上传结果")
                                console.log(res.data)
                                if(res.data.code==0){
                                    startCoiunt++;
                                }
                                this.percent = Math.floor((startCoiunt / chunks) * 100);
                                console.log("当前完成数："+startCoiunt)
                                if(startCoiunt == chunks){
                                    let params = {
                                        chunk_count:chunks,
                                        file_hash:"060e4e9e30bcb9ae675a80328a87a687",
                                        file_size:file.size,
                                        file_name:file.name,
                                    }

                                    setTimeout(()=>{
                                        this.toMerge(params)
                                    },1000)
                                }else{
                                    console.log("当前完成数2222："+startCoiunt)
                                }
                            })
                            .catch(err => {
                            });

                        await this.sleep(100)
                    }

                }catch (e) {
                    console.log("eeeeeeeeeeeeeeeeeeeee")
                    console.log(e)
                }
            },
            sleep(time) {
                return new Promise(resolve => setTimeout(resolve, time))
            },
            toMerge (params){
                // 待所有块上传完成后，发送合并请求
                console.log("山川完毕")
                let that =this
                //请求合并
                this.$http
                    .post(this.setting.baseURL+'/upload/merge', params)  // 上传块数据
                    .then(res => {
                        console.log("合并结果")
                        console.log(res)
                        console.log( res.data.data.url)
                        that.editForm = res.data
                        that.$forceUpdate()
                    })
                    .catch(err => {

                        console.log("eeeeeeeeeeeeeeee")
                        console.log(err)
                    });
            },
            handleBeforeUpload(files) {
                console.log("handleBeforeUpload")
                console.log(files)
                return
                this.$http
                    .post(this.setting.baseURL+'/upload/beforeUpload', params)  // 上传块数据
                    .then(res => {
                        console.log("合并结果")
                        console.log(res)
                    })
                    .catch(err => {

                        console.log("eeeeeeeeeeeeeeee")
                        console.log(err)
                    });

                // TODO: 检查文件大小、类型等
            },
            /* 刷新表格 */
            reload() {
                this.$refs.table.reload({where: this.where});
            },
            search(){
                this.$refs.table.reload({where: this.where,page:1});
            },
            /* 重置搜索 */
            reset() {
                this.where = {
                    title:"",
                };
                this.$refs.table.reload({where: this.where,page:1});
                // this.$refs.table.pageCurrentChange(1)
            },

            /* 删除 */
            remove(row) {
                const loading = this.$loading({lock: true});
                this.$http.post('/video/delete', {id: row.id}).then(res => {
                    loading.close();
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.reload();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(e => {
                    loading.close();
                    this.$message.error(e.message);
                });
            },

            handleProgress(event, file) {
                // 显示上传进度
                this.percent = Math.floor((event.loaded / event.total) * 100);
            },

        }
    }
</script>

<style scoped lang="scss">


    .printBox{
        /*margin-top: 12px;*/
        top: 12px;
        margin-bottom: 23px;
        position: relative;
        width:320px;
        font-size: 14px;
        color: #000;
        line-height: 20px;
        div{
        }
        border: 1px solid #000000;
        border-radius: 4px;
        .printTitle{
            word-break: break-all;
        }
        .printTitle2{
            word-break: break-all;
            text-align: center;
            font-size:22px;
            font-weight: bold;
        }
        .cborder{
            border-bottom: 1px solid #000;
        }
        .printNoDp{
            flex: 1;

        }
        .printQrcode{
            text-align: center;
            text-indent: 0px !important;
            line-height: auto !important;
            border-left: 1px solid #000;

            img{
                width: 100px;
                height: 100px;
            }

        }

        .qrcode{
            padding-top: 10px;
            width: 120px;

            text-align: center;
            /*height: 100px;*/
        }
    }
    .cheight{
        padding-left: 8px;
        height: 45px;
        padding-right: 8px;
    }


    .printBox2{
        top: 12px;
        margin-bottom: 23px;
        position: relative;
        width:320px;
        font-size: 14px;
        color: #000;
        line-height: 20px;
        div{
        }
        border: 1px solid #000000;
        border-radius: 4px;
        .cheight2{
            padding-left: 5px;
            padding-right: 5px;
            text-indent: 0.2em;
            height: 46px;
        }
        .printTitle2{
            word-break: break-all;
            text-align: center;
            font-size:22px;
            font-weight: bold;
        }
        .cborder{
            border-bottom: 1px solid #000;
        }
        .printNoDp{
            flex: 1;

        }
        .printQrcode{
            border-left: 1px solid #000;
            text-indent: 0px !important;
            line-height: auto !important;
            img{
                width: 100px;
                height: 100px;
            }
        }
        .qrcode{
            padding-top: 10px;
            width: 120px;
            text-align: center;
        }
    }
    .ttips{
        font-size: 12px;
        padding-top: 3px;
        padding-bottom: 2px;
        text-align: center;
    }
    .cma{
        height:45px;
        align-items: center;
        padding-left: 8px;
        word-break: break-all;
    }
</style>
