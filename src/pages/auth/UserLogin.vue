<template>
  <div class="login-container">
    <!-- 头部Logo区域 -->
    <div class="header-section">
      <div class="logo-container">
        <van-icon name="friends" size="60" color="#1989fa" />
        <h1 class="app-title">学习伙伴</h1>
        <p class="app-subtitle">找到志同道合的学习伙伴，一起进步</p>
      </div>
    </div>

    <!-- 登录表单 -->
    <div class="form-section">
      <van-form @submit="onSubmit" class="login-form">
        <van-cell-group inset class="form-group">
          <van-field
            v-model="userAccount"
            name="userAccount"
            label="账号"
            placeholder="请输入账号"
            left-icon="manager"
            clearable
            :rules="[{ required: true, message: '请填写账号' }]"
            :error="accountError"
            :error-message="accountErrorMessage"
            @blur="validateAccount"
          />
          <van-field
            v-model="userPassword"
            type="password"
            name="userPassword"
            label="密码"
            placeholder="请输入密码"
            left-icon="lock"
            clearable
            :rules="[{ required: true, message: '请填写密码' }]"
            :error="passwordError"
            :error-message="passwordErrorMessage"
            @blur="validatePassword"
          />
        </van-cell-group>

        <!-- 登录按钮 -->
        <div class="button-section">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="isLoading"
            :disabled="isLoading"
            class="login-btn"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </van-button>
        </div>

        <!-- 注册链接 -->
        <div class="register-section">
          <van-divider>还没有学习账号？</van-divider>
          <van-button
            round
            block
            type="default"
            @click="Register"
            class="register-btn"
          >
            加入学习社区
          </van-button>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
          <van-button type="default" size="small" plain @click="showForgotPassword">
            忘记密码？
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 底部装饰 -->
    <div class="footer-section">
      <p class="footer-text">让学习更有趣，让进步更快乐</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { postUserLogin } from '@/api/dist/controller'
import { showSuccessToast, showFailToast, showToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()
const userAccount = ref('')
const userPassword = ref('')
const latitude = ref(30)
const longitude = ref(120)
const isLoading = ref(false)
const accountError = ref(false)
const accountErrorMessage = ref('')
const passwordError = ref(false)
const passwordErrorMessage = ref('')

// 验证用户名
const validateAccount = () => {
  if (!userAccount.value) {
    accountError.value = false
    accountErrorMessage.value = ''
    return false
  }

  if (userAccount.value.length < 4) {
    accountError.value = true
    accountErrorMessage.value = '用户名至少4个字符'
    return false
  }

  accountError.value = false
  accountErrorMessage.value = ''
  return true
}

// 验证密码
const validatePassword = () => {
  if (!userPassword.value) {
    passwordError.value = false
    passwordErrorMessage.value = ''
    return false
  }

  if (userPassword.value.length < 8) {
    passwordError.value = true
    passwordErrorMessage.value = '密码至少需要8个字符'
    return false
  }

  passwordError.value = false
  passwordErrorMessage.value = ''
  return true
}

const onSubmit = async () => {
  // 表单验证
  const isAccountValid = validateAccount()
  const isPasswordValid = validatePassword()

  if (!isAccountValid || !isPasswordValid) {
    showFailToast('请检查输入信息')
    return
  }

  isLoading.value = true

  try {
    const input = {
      userAccount: userAccount.value,
      userPassword: userPassword.value,
      latitude: latitude.value,
      longitude: longitude.value
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await postUserLogin(input, config)

    if (res.data.code === 0) {
      showSuccessToast('登录成功')
      await router.replace('/')
    } else {
      const errorMessage = res.data.message || '登录失败，请检查用户名和密码'
      showFailToast(errorMessage)
    }
  } catch (error) {
    console.error('登录失败:', error)
    showFailToast('网络错误，请检查网络连接后重试')
  } finally {
    isLoading.value = false
  }
}

const Register = () => {
  router.push('/user/register')
}

const showForgotPassword = () => {
  showToast('该功能暂未开放')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.header-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 20px;
  position: relative;
  z-index: 1;
}

.logo-container {
  text-align: center;
  animation: slideDown 0.8s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 16px 0 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.app-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

.form-section {
  flex: 2;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.login-form {
  animation: slideUp 0.8s ease-out 0.2s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.form-group :deep(.van-cell) {
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.form-group :deep(.van-cell:last-child) {
  border-bottom: none;
}

.form-group :deep(.van-field__left-icon) {
  color: #1989fa;
  margin-right: 12px;
}

.form-group :deep(.van-field__control) {
  font-size: 16px;
}

.button-section {
  margin: 32px 0 24px;
}

.login-btn {
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #1989fa 0%, #1976d2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(25, 137, 250, 0.4);
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  transform: none;
}

.register-section {
  margin: 24px 0;
}

.register-section :deep(.van-divider) {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  margin: 16px 0;
}

.register-btn {
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.register-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(1px);
}

.quick-actions {
  text-align: center;
  margin: 20px 0;
}

.quick-actions .van-button {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  background: transparent;
  transition: all 0.3s ease;
}

.quick-actions .van-button:active {
  color: white;
  border-color: rgba(255, 255, 255, 0.6);
}

.footer-section {
  padding: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  font-weight: 300;
}

/* 错误状态样式 */
:deep(.van-field--error .van-field__control) {
  color: #ee0a24;
}

:deep(.van-field--error .van-field__left-icon) {
  color: #ee0a24;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .app-title {
    font-size: 28px;
  }

  .app-subtitle {
    font-size: 14px;
  }

  .login-btn {
    height: 46px;
    font-size: 16px;
  }

  .register-btn {
    height: 40px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .form-group {
    background: rgba(0, 0, 0, 0.8);
  }

  .form-group :deep(.van-cell) {
    color: white;
  }
}
</style>
