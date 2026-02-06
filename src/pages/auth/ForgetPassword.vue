<template>
  <div class="forget-password-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="logo-container">
        <van-icon name="lock" size="50" color="#3498db" />
        <h1 class="app-title">找回密码</h1>
        <p class="app-subtitle">通过邮箱验证重置您的密码</p>
      </div>
    </div>

    <!-- 找回密码表单 -->
    <div class="form-section">
      <van-form @submit="onSubmit" class="forget-form">
        <!-- 账号信息 -->
        <div class="form-step">
          <h3 class="step-title">
            <van-icon name="user-o" />
            账号信息
          </h3>
          <van-cell-group inset class="form-group">
            <van-field
              v-model="userAccount"
              name="userAccount"
              label="账号"
              placeholder="请输入您的账号"
              left-icon="manager"
              clearable
              :rules="[{ required: true, message: '请填写账号' }]"
              :error="accountError"
              :error-message="accountErrorMessage"
              @blur="validateAccount"
            />
          </van-cell-group>
        </div>

        <!-- 邮箱验证 -->
        <div class="form-step">
          <h3 class="step-title">
            <van-icon name="envelop-o" />
            邮箱验证
          </h3>
          <van-cell-group inset class="form-group">
            <van-field
              v-model="email"
              name="email"
              label="邮箱"
              placeholder="请输入注册时的邮箱"
              left-icon="envelop-o"
              clearable
              :rules="[{ required: true, message: '请填写邮箱' }]"
              :error="emailError"
              :error-message="emailErrorMessage"
              @blur="validateEmail"
            />
            <div class="verification-row">
              <van-field
                v-model="code"
                name="code"
                label="验证码"
                placeholder="请输入验证码"
                left-icon="shield-o"
                clearable
                :rules="[{ required: true, message: '请输入验证码' }]"
                class="code-field"
              />
              <van-button
                class="send-code-btn"
                type="primary"
                size="small"
                @click="sendCode"
                :disabled="countdown > 0 || isSending || !email || emailError"
                :loading="isSending"
              >
                {{ getSendCodeButtonText() }}
              </van-button>
            </div>
          </van-cell-group>
        </div>

        <!-- 新密码设置 -->
        <div class="form-step">
          <h3 class="step-title">
            <van-icon name="lock" />
            设置新密码
          </h3>
          <van-cell-group inset class="form-group">
            <van-field
              v-model="userPassword"
              type="password"
              name="userPassword"
              label="新密码"
              placeholder="请输入新密码(至少8位)"
              left-icon="lock"
              clearable
              :minlength="8"
              :rules="[{ required: true, message: '密码不少于8位' }]"
              :error="passwordError"
              :error-message="passwordErrorMessage"
              @blur="validatePassword"
            />
            <van-field
              v-model="checkPassword"
              type="password"
              name="checkPassword"
              label="确认密码"
              placeholder="请再次输入新密码"
              left-icon="lock"
              clearable
              :minlength="8"
              :rules="[{ required: true, message: '请再次输入密码' }]"
              :error="confirmPasswordError"
              :error-message="confirmPasswordErrorMessage"
              @blur="validateConfirmPassword"
            />
          </van-cell-group>
        </div>

        <!-- 提交按钮 -->
        <div class="button-section">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="submit-btn"
          >
            {{ isSubmitting ? '提交中...' : '重置密码' }}
          </van-button>
        </div>

        <!-- 返回登录链接 -->
        <div class="login-section">
          <van-divider>想起密码了？</van-divider>
          <van-button round block type="default" @click="goToLogin" class="login-link-btn">
            返回登录
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 底部提示 -->
    <div class="footer-section">
      <p class="footer-text">请确保使用注册时填写的邮箱进行验证</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api/apiClient'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

const userAccount = ref('')
const userPassword = ref('')
const checkPassword = ref('')
const email = ref('')
const code = ref('')
const countdown = ref(0)
const isSending = ref(false)
const isSubmitting = ref(false)
const emailError = ref(false)
const emailErrorMessage = ref('')
const accountError = ref(false)
const accountErrorMessage = ref('')
const passwordError = ref(false)
const passwordErrorMessage = ref('')
const confirmPasswordError = ref(false)
const confirmPasswordErrorMessage = ref('')

// 验证账号
const validateAccount = () => {
  if (!userAccount.value) {
    accountError.value = false
    accountErrorMessage.value = ''
    return false
  }

  if (userAccount.value.length < 4) {
    accountError.value = true
    accountErrorMessage.value = '账号至少4位'
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
    passwordErrorMessage.value = '密码至少8位'
    return false
  }

  passwordError.value = false
  passwordErrorMessage.value = ''
  return true
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!checkPassword.value) {
    confirmPasswordError.value = false
    confirmPasswordErrorMessage.value = ''
    return false
  }

  if (checkPassword.value !== userPassword.value) {
    confirmPasswordError.value = true
    confirmPasswordErrorMessage.value = '两次密码不一致'
    return false
  }

  confirmPasswordError.value = false
  confirmPasswordErrorMessage.value = ''
  return true
}

// 邮箱格式验证
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = false
    emailErrorMessage.value = ''
    return false
  }

  if (!emailRegex.test(email.value)) {
    emailError.value = true
    emailErrorMessage.value = '邮箱格式错误'
    return false
  }

  emailError.value = false
  emailErrorMessage.value = ''
  return true
}

// 获取发送验证码按钮文本
const getSendCodeButtonText = () => {
  if (isSending.value) {
    return '发送中...'
  }
  if (countdown.value > 0) {
    return `${countdown.value}s后重发`
  }
  return '发送验证码'
}

// 启动倒计时
const startCountdown = () => {
  countdown.value = 120
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 发送验证码
const sendCode = async () => {
  isSending.value = true

  try {
    // 验证邮箱格式
    if (!validateEmail()) {
      showFailToast('请输入正确的邮箱格式')
      return
    }

    // 发送找回密码验证码请求
    const res = await api.user.sendCodePa({ email: email.value })

    if (res.data.code === 0) {
      showSuccessToast('验证码已发送')
      startCountdown()
    } else {
      const errorMessage = res.data.message || '发送验证码失败'
      showFailToast(errorMessage)
    }
  } catch (error) {
    showFailToast('网络错误，请检查网络连接后重试')
  } finally {
    isSending.value = false
  }
}

// 提交表单
const onSubmit = async () => {
  // 全面验证表单
  const isAccountValid = validateAccount()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  const isEmailValid = validateEmail()

  if (!isAccountValid || !isPasswordValid || !isConfirmPasswordValid || !isEmailValid) {
    showFailToast('请检查输入信息')
    return
  }

  if (!code.value) {
    showFailToast('请输入验证码')
    return
  }

  isSubmitting.value = true

  try {
    const input = {
      userAccount: userAccount.value,
      userPassword: userPassword.value,
      checkPassword: checkPassword.value,
      email: email.value,
      code: code.value,
    }

    const res = await api.user.forgetPassword(input)

    if (res.data.code === 0) {
      showSuccessToast('密码重置成功！即将跳转到登录页面')
      setTimeout(() => {
        router.replace('/user/login')
      }, 1500)
    } else {
      const errorMessage = res.data.message || '密码重置失败，请重试'
      showFailToast(errorMessage)
    }
  } catch (error) {
    showFailToast('网络错误，请检查网络连接后重试')
  } finally {
    isSubmitting.value = false
  }
}

const goToLogin = () => {
  router.push('/user/login')
}
</script>

<style scoped>
.forget-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #3498db 0%, #8e44ad 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.forget-password-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="geometric" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0,0 L20,0 L20,20 L0,20 Z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23geometric)"/></svg>');
  animation: float 25s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.header-section {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px 15px;
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
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 12px 0 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.app-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

.form-section {
  flex: 1;
  padding: 0 20px 20px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
}

.forget-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
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

.form-step {
  margin-bottom: 16px;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  padding-left: 4px;
}

.step-title .van-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
}

.form-group {
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

.verification-row {
  display: flex;
  align-items: center;
  padding-right: 12px;
  background: transparent;
}

.code-field {
  flex: 1;
}

.code-field :deep(.van-field__control) {
  font-size: 15px;
}

.send-code-btn {
  flex-shrink: 0;
  min-width: 100px;
  height: 32px;
  font-size: 12px;
  border-radius: 16px;
  margin-left: 8px;
}

.send-code-btn:active {
  transform: translateY(1px);
}

.send-code-btn:disabled {
  opacity: 0.6;
}

.button-section {
  margin: 24px 0 20px;
}

.submit-btn {
  height: 48px;
  font-size: 17px;
  font-weight: 600;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.4);
  transition: all 0.3s ease;
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  transform: none;
}

.login-section {
  margin: 20px 0;
}

.login-section :deep(.van-divider) {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  margin: 16px 0;
}

.login-link-btn {
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.login-link-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(1px);
}

.footer-section {
  padding: 16px 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
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

:deep(.van-field__error-message) {
  font-size: 12px;
  color: #ee0a24;
  padding: 4px 0 0 30px;
}

:deep(.van-field__label) {
  width: 70px;
  font-size: 14px;
}

:deep(.van-field__control) {
  font-size: 15px;
}

:deep(.van-field__control::placeholder) {
  font-size: 14px;
  color: #c8c9cc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-section {
    padding: 0 16px 20px;
  }

  .forget-form {
    max-width: 100%;
    width: 100%;
  }

  .app-title {
    font-size: 24px;
  }

  .app-subtitle {
    font-size: 13px;
  }

  .step-title {
    font-size: 15px;
  }

  .submit-btn {
    height: 46px;
    font-size: 16px;
  }

  .send-code-btn {
    min-width: 90px;
    font-size: 11px;
  }

  .header-section {
    padding: 20px 16px 10px;
  }

  .footer-section {
    padding: 12px 16px;
  }

  .footer-text {
    font-size: 12px;
  }

  :deep(.van-field__error-message) {
    font-size: 11px;
  }

  :deep(.van-field__label) {
    width: 65px;
    font-size: 13px;
  }

  :deep(.van-field__control) {
    font-size: 14px;
  }

  .verification-row {
    flex-wrap: nowrap;
    gap: 8px;
  }

  :deep(.van-field__control::placeholder) {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 22px;
  }

  .app-subtitle {
    font-size: 12px;
  }

  .step-title {
    font-size: 14px;
  }

  .submit-btn {
    height: 44px;
    font-size: 15px;
  }

  .send-code-btn {
    min-width: 80px;
    height: 30px;
    font-size: 11px;
  }

  .form-section {
    padding: 0 12px 16px;
  }

  .header-section {
    padding: 16px 12px 8px;
  }

  .footer-section {
    padding: 10px 12px;
  }

  :deep(.van-field__error-message) {
    font-size: 10px;
    padding-left: 28px;
  }

  :deep(.van-field__label) {
    width: 60px;
    font-size: 12px;
  }

  :deep(.van-field__control) {
    font-size: 13px;
  }

  .verification-row {
    padding-right: 8px;
    gap: 4px;
  }

  .code-field {
    flex: 1;
  }

  .send-code-btn {
    margin-left: 4px;
  }

  :deep(.van-field__control::placeholder) {
    font-size: 12px;
  }
}

.form-section::-webkit-scrollbar {
  width: 4px;
}

.form-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.form-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.form-section::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
