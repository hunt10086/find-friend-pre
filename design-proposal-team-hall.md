# 队伍大厅设计改进建议

## 设计目标
- 移除搜索框的紫色渐变，采用更简洁的设计
- 优化队伍卡片，保持简约但不失美感

## 改进内容

### 1. 搜索框设计
- 背景颜色改为白色或浅灰色
- 保留圆角搜索框，但移除渐变效果
- 使用更现代的边框和阴影

### 2. 卡片设计（简约风格）
- 背景采用纯白色，增加柔和阴影
- 移除渐变背景，采用简洁配色
- 保持足够的留白，增强视觉舒适度
- 使用圆角矩形，提升现代化感觉
- 保留重要的信息层级结构

### 3. 具体实现代码建议

```vue
<template>
  <!-- 搜索框部分 -->
  <van-search
    v-model="values"
    placeholder="请输入搜索关键词"
    wrap-with-form
    show-action
    @search="onSearch"
    @cancel="onCancel"
    class="team-search-modern"
  />

  <!-- 队伍卡片容器 -->
  <div v-if="flag" class="team-cards-container-modern">
    <div
      class="team-card-modern"
      v-for="(team, index) in teamList"
      :key="team.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <!-- 队伍头像和信息 -->
      <div class="team-header-modern">
        <div class="team-icon-modern">
          <img :src="team.icon || '/ava.jpg'" :alt="team.teamName" class="team-avatar-modern" />
          <div class="team-status-modern" :class="{ private: team.status === 1 }">
            <van-icon :name="team.status === 1 ? 'lock' : 'eye-o'" />
          </div>
        </div>
        <div class="team-info-modern">
          <h3 class="team-name-modern">{{ team.teamName }}</h3>
          <div class="team-meta-modern">
            <van-tag :type="team.status === 1 ? 'warning' : 'success'" size="small" plain>
              {{ team.status === 1 ? '加密' : '公开' }}
            </van-tag>
            <span class="team-members-modern">
              <van-icon name="friends-o" />
              {{ team.nowNum }}/{{ team.maxNum }}
            </span>
          </div>
        </div>
      </div>

      <!-- 队伍描述 -->
      <div class="team-content-modern">
        <p class="team-description-modern" v-if="team.description">
          {{ team.description }}
        </p>

        <!-- 进度条 -->
        <div class="team-progress-modern">
          <div class="progress-label-modern">队伍进度</div>
          <div class="progress-bar-modern">
            <div
              class="progress-fill-modern"
              :style="{ width: `${(team.nowNum / team.maxNum) * 100}%` }"
            ></div>
          </div>
          <span class="progress-text-modern">{{ team.nowNum }}/{{ team.maxNum }}</span>
        </div>

        <!-- 时间信息 -->
        <div class="team-time-modern">
          <div class="time-item-modern">
            <van-icon name="clock-o" />
            <span>创建: {{ formatTime(team.createTime) }}</span>
          </div>
          <div class="time-item-modern">
            <van-icon name="replay" />
            <span>更新: {{ formatTime(team.updateTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="team-actions-modern">
        <van-button type="default" size="small" round @click="inTeam(team)">
          查看详情
        </van-button>
        <van-button
          type="primary"
          size="small"
          round
          @click="joinTeam(team)"
          :disabled="team.nowNum >= team.maxNum"
        >
          {{ team.nowNum >= team.maxNum ? '已满员' : '加入队伍' }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 现代化搜索框 */
.team-search-modern {
  padding: 12px 16px;
  background: #f5f5f5; /* 淡灰色背景替代紫色渐变 */
}

.team-search-modern :deep(.van-search__content) {
  border-radius: 20px;
  background-color: white;
  border: 1px solid #eaeaea; /* 添加边框 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
}

/* 简约卡片容器 */
.team-cards-container-modern {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 简约卡片样式 */
.team-card-modern {
  background: white; /* 纯白色背景 */
  border-radius: 12px; /* 简化圆角 */
  padding: 16px; /* 减少内边距 */
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); /* 温和阴影 */
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0; /* 添加轻边框 */
}

.team-card-modern:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* 悬停效果 */
  transform: translateY(-2px);
}

/* 头部布局 */
.team-header-modern {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.team-icon-modern {
  position: relative;
  flex-shrink: 0;
}

.team-avatar-modern {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.team-status-modern {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: #1989fa; /* 蓝色主题 */
  color: white;
  border: 1px solid white;
}

.team-status-modern.private {
  background: #ee0a24; /* 红色用于私密 */
}

.team-info-modern {
  flex: 1;
}

.team-name-modern {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.team-meta-modern {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-members-modern {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

/* 内容区域 */
.team-content-modern {
  margin-bottom: 12px;
}

.team-description-modern {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team-progress-modern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-label-modern {
  font-size: 11px;
  color: #999;
  min-width: 50px;
}

.progress-bar-modern {
  flex: 1;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-modern {
  height: 100%;
  background: #1989fa;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text-modern {
  font-size: 11px;
  color: #1989fa;
  font-weight: 500;
  min-width: 35px;
  text-align: right;
}

.team-time-modern {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-item-modern {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.time-item-modern .van-icon {
  font-size: 11px;
}

/* 操作按钮 */
.team-actions-modern {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.team-actions-modern .van-button {
  flex: 1;
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 18px;
  border: 1px solid #eaeaea;
  background: white;
}

.team-actions-modern .van-button--primary {
  background: #1989fa;
  border-color: #1989fa;
  color: white;
}

.team-actions-modern .van-button:disabled {
  opacity: 0.5;
}
</style>
```

## 设计理念
1. **简化色彩**：移除过多的渐变效果，以白色为主色调
2. **增强可读性**：保持良好的对比度，确保文字清晰易读
3. **保持功能**：保留所有重要功能和信息展示
4. **优化体验**：通过细微的动效和阴影提升交互感受

请审核以上设计方案，如果满意我可以帮您实施这些更改。