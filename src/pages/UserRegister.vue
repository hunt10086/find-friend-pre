<template>
  <div class="register-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="logo-container">
        <van-icon name="add-square" size="50" color="#1989fa" />
        <h1 class="app-title">加入学习社区</h1>
        <p class="app-subtitle">创建账号，开始寻找学习伙伴的旅程</p>
      </div>
    </div>

    <!-- 注册表单 -->
    <div class="form-section">
      <van-form @submit="onSubmit" class="register-form">
        <!-- 基本信息 -->
        <div class="form-step">
          <h3 class="step-title">
            <van-icon name="user-o" />
            基本信息
          </h3>
          <van-cell-group inset class="form-group">
            <van-field
              v-model="userAccount"
              name="userAccount"
              label="用户名"
              placeholder="请输入用户名（至少4位）"
              left-icon="manager"
              clearable
              :minlength="4"
              :rules="[{ required: true, message: '请填写不小于4位的用户名' }]"
              :error="accountError"
              :error-message="accountErrorMessage"
              @blur="validateAccount"
            />
            <van-field
              v-model="userPassword"
              type="password"
              name="userPassword"
              label="密码"
              placeholder="请输入密码（至少8位）"
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
              placeholder="请再次输入密码"
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
              placeholder="请输入邮箱地址"
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
                @click="SendCode"
                :disabled="countdown > 0 || isSending || !email || emailError"
                :loading="isSending"
              >
                {{ getSendCodeButtonText() }}
              </van-button>
            </div>
          </van-cell-group>
        </div>

        <!-- 注册按钮 -->
        <div class="button-section">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
            :loading="isRegistering"
            :disabled="isRegistering"
            class="register-btn"
          >
            {{ isRegistering ? '注册中...' : '立即注册' }}
          </van-button>
        </div>

        <!-- 登录链接 -->
        <div class="login-section">
          <van-divider>已经是学习社区成员？</van-divider>
          <van-button 
            round 
            block 
            type="default" 
            @click="goToLogin"
            class="login-link-btn"
          >
            返回登录
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 底部提示 -->
    <div class="footer-section">
      <p class="footer-text">加入学习社区，与优秀的同学一起成长进步</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUserSendCode, postUserLogin, postUserRegister } from '@/api/controller'
import { showFailToast, showSuccessToast, showToast, Toast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

const userAccount = ref('')
const userPassword = ref('')
const checkPassword = ref('')
const email = ref('')
const code = ref('')
const countdown = ref(0)
const isSending = ref(false)
const isRegistering = ref(false)
const emailError = ref(false)
const emailErrorMessage = ref('')
const accountError = ref(false)
const accountErrorMessage = ref('')
const passwordError = ref(false)
const passwordErrorMessage = ref('')
const confirmPasswordError = ref(false)
const confirmPasswordErrorMessage = ref('')

// 验证用户名
const validateAccount = () => {
  if (!userAccount.value) {
    accountError.value = false
    accountErrorMessage.value = ''
    return false
  }
  
  if (userAccount.value.length < 4) {
    accountError.value = true
    accountErrorMessage.value = '用户名至少需要4个字符'
    return false
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(userAccount.value)) {
    accountError.value = true
    accountErrorMessage.value = '用户名只能包含字母、数字和下划线'
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

// 验证确认密码
const validateConfirmPassword = () => {
  if (!checkPassword.value) {
    confirmPasswordError.value = false
    confirmPasswordErrorMessage.value = ''
    return false
  }
  
  if (checkPassword.value !== userPassword.value) {
    confirmPasswordError.value = true
    confirmPasswordErrorMessage.value = '两次输入的密码不一致'
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
    emailErrorMessage.value = '请输入正确的邮箱格式'
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

const SendCode = async () => {
  // 立即显示加载状态，提供即时反馈
  isSending.value = true
  
  try {
    // 验证邮箱格式
    if (!validateEmail()) {
      showFailToast('请输入正确的邮箱格式')
      return
    }

    // 发送请求
    const res = await getUserSendCode({ email: email.value })
    
    if (res.data.code === 0) {
      showSuccessToast('验证码已发送')
      startCountdown()
    } else {
      // 根据错误码提供更具体的错误信息
      const errorMessage = res.data.message || '发送验证码失败'
      showFailToast(errorMessage)
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    showFailToast('网络错误，请检查网络连接后重试')
  } finally {
    // 确保加载状态被清除
    isSending.value = false
  }
}

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
  
  isRegistering.value = true
  
  try {
    const input = {
      userAccount: userAccount.value,
      userPassword: userPassword.value,
      checkPassword: checkPassword.value,
      email: email.value,
      code: code.value,
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    const res = await postUserRegister(input, config)
    
    if (res.data.code === 0) {
      showSuccessToast('注册成功！即将跳转到登录页面')
      setTimeout(() => {
        router.replace('/user/login')
      }, 1500)
    } else {
      const errorMessage = res.data.message || '注册失败，请重试'
      showFailToast(errorMessage)
    }
  } catch (error) {
    console.error('注册失败:', error)
    showFailToast('网络错误，请检查网络连接后重试')
  } finally {
    isRegistering.value = false
  }
}

const goToLogin = () => {
  router.push('/user/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.register-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  animation: drift 30s ease-in-out infinite;
  pointer-events: none;
}

@keyframes drift {
  0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  33% { transform: translateX(-30px) translateY(-30px) rotate(120deg); }
  66% { transform: translateX(30px) translateY(-30px) rotate(240deg); }
}

.header-section {
  padding: 20px 20px 15px;
  text-align: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
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
  margin: 12px 0 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

.form-section {
  padding: 0 16px 80px;
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
}

.register-form {
  animation: slideUp 0.8s ease-out 0.2s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-step {
  margin-bottom: 20px;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.step-title .van-icon {
  color: #1989fa;
  background: white;
  border-radius: 50%;
  padding: 4px;
}

.form-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  margin-right: 8px;
}

.verification-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
}

.code-field {
  flex: 1;
}

.code-field :deep(.van-field__control) {
  border: none;
  background: transparent;
}

.send-code-btn {
  flex-shrink: 0;
  min-width: 100px;
  height: 36px;
  border-radius: 18px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.send-code-btn:active {
  transform: scale(0.95);
}

.send-code-btn:disabled {
  opacity: 0.5;
}

.button-section {
  margin: 24px 0 16px;
}

.register-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #1989fa 0%, #1976d2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(25, 137, 250, 0.4);
  transition: all 0.3s ease;
}

.register-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.4);
}

.register-btn:disabled {
  opacity: 0.7;
  transform: none;
}

.login-section {
  margin: 16px 0;
}

.login-section :deep(.van-divider) {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  margin: 12px 0;
}

.login-link-btn {
  height: 40px;
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
  padding: 16px 20px 20px;
  text-align: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
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
    font-size: 24px;
  }
  
  .app-subtitle {
    font-size: 13px;
  }
  
  .step-title {
    font-size: 14px;
  }
  
  .register-btn {
    height: 44px;
    font-size: 15px;
  }
  
  .send-code-btn {
    min-width: 90px;
    font-size: 12px;
  }
  
  .form-section {
    padding: 0 12px 60px;
  }
  
  .header-section {
    padding: 15px 15px 10px;
  }
  
  .footer-section {
    padding: 12px 15px 15px;
  }
  
  .footer-text {
    font-size: 11px;
    line-height: 1.3;
  }
}

/* 滚动条样式 */
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
