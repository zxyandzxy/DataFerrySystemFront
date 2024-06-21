<template>
  <el-dialog v-model="show" :title="title" width="500" @close="closeDialog">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item :label="field1Name" prop="field1">
        <el-input v-model="form.field1"></el-input>
      </el-form-item>
      <el-form-item :label="field2Name" prop="field2">
        <el-input v-model="form.field2"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, reactive, watch } from 'vue'
  import { FormInstance, FormRules } from 'element-plus'

  const props = defineProps({
    show: Boolean,
    title: String,
    field1Name: String,
    field2Name: String,
  })

  const emit = defineEmits(['update:show', 'submit'])

  const form = reactive({
    field1: '',
    field2: '',
  })

  const rules = reactive<FormRules>({
    field1: [{ required: true, message: '此项必须填写', trigger: 'blur' }],
    field2: [{ required: true, message: '此项必须填写', trigger: 'blur' }],
  })

  const formRef = ref<FormInstance>()

  const closeDialog = () => {
    emit('update:show', false)
    resetForm()
  }

  const submitForm = async () => {
    if (!formRef.value) return
    await formRef.value.validate()
    emit('submit', form)
    closeDialog()
  }

  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  // Watch the `show` prop and reset the form when the dialog is closed
  watch(
    () => props.show,
    (newVal) => {
      if (!newVal) {
        resetForm()
      }
    },
  )
</script>

<style scoped>
  .dialog-footer {
    text-align: right;
  }
</style>
``
