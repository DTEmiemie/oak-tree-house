---
title: 网络系统2论文阅读
author: 孙子平
date: 2020-01-22T12:39:16Z
category: 大作业
tags: [大作业]
---

这篇文章是网络系统2第4个大作业阅读论文的笔记。论文是由个人选取的，我选了[Hybrid Beamforming for 5G Millimeter-Wave Multi-Cell Networks](https://arxiv.org/pdf/1803.03986.pdf)。论文选得有些偏难，所以最后的效果不是很好。点击[此处](/assets/blog/network-system2-paper-reading/presentation.pdf)下载幻灯片。点击[此处](/assets/blog/network-system2-paper-reading/reading-summary.pdf)下载1页的简要阅读报告。

<!-- more -->

## 0 摘要

多小区无线系统经常收到小区内和小区间的干扰，使用协同多点CoMP（MIMO的一种，数据和CSI信道状态信息在相邻基站中共享）可以减轻干扰。前人的研究多半集中在数字波束成型，这需要每一个天线都有一整套RF chain（一系列的电子设备，包含放大、滤波等等）。而毫米波需要大量的天线，因而数字波束成型不再可行。本论文提出4中模拟和数字混合的波束成型方案，借助CoMP，用于多小区、多用户、多流的毫米波通讯。论文对提出的混合波束成型的频谱效率与3GPP的和NYUSIM的进行了对比。模拟结果显示基于最大化信号泄露噪声比的CoMP相较于无协作的可以提交频谱效率，而不同波束成型的频谱效率依赖于小区半径和每小区用户数。

## 1 介绍

5G网络需要部署毫米波蜂窝网络。而其中的一个挑战是如何消除或减轻小区间干扰。对此有两种做法：

- 电源控制。使同一小区内的各个用户的信号干扰噪声比SINR一致，从而改进那些较弱的连接。
- 天线阵列波束形成。通讯两端都使用天线阵列，这样可以补偿传输第一米的损耗（自由空间路径损耗FSPL），然后不同小区的基站BS或传输点TP合作收发。

总的来说，第二个做法更好。

3GPP对4G中使用的CoMP进行了一次调查。不同的CoMP策略有不同的复杂度，也需要不同程度的CSI反馈和共享。以下按照复杂程度递增顺序列出这些策略：

1. 协同调度/波束成型：用户设备UE的数据只在一个TP就绪，并在一个时间频率内，只有这一个TP传输，但用户调度和波束成型的决定是有多个TP协同的。
2. 动态点选择DPS/静默：数据在多个TP同时就绪，但在一个时间频率内，只有一个TP传输数据，而发送或者静默的TP可能在不同的子帧改变。
3. 联合传输：UE的数据在多个TP就绪，并且在一个时间频率内，多个TP向一个或多个UE传输数据。

BS协调减轻干扰被广泛地研究，但这些研究都是全数字波束成型，并且每一个天线后面都需要RF chain，这不太适合毫米波系统，因为它们有大量的天线，这会增加复杂度、能耗和成本。多小区的BS协作也被广泛地研究，但这些研究中移动端接收器只配备了一个全向天线，因而只有通讯的时候只有一个流。在5G毫米波系统，天线阵列也会部署在移动接收端，从而提供阵列增益、波束成型和空间复用。

本篇论文研究多小区、多用户、多流和混合波束成型HBF策略，用以MIMO。我们有4个方案：3个使用协同调度/波束成型，另一个则不使用任何TP协同作为baseline。我们着重于TP到UE的传输，且每个流的供电都一样（没有电源控制）。我们制定了一个多小区框架，它基于现今的3扇面BS天线，每个120°天线拥有256个天线（8行16列2偏振）呈均匀矩形阵列URA，这与现在设想的5G MIMO系统类似。每个相邻的偏振元素在方位角上距离$\lambda/2$，在仰角上距离$\lambda$，其中$\lambda$是载波波长，它在宽边提供约8°的3dB波束宽度分辨率。注意RF chain的数目决定了能传输的独立流的最大数目。一定数量（在这里是3或12）UE被随机分配到各个小区，距离从10m到小区半径，它们每个都有8元素（2行2列2偏振）的URA和4个RF chain。100MHz的带宽被用于OFDM调制。5G会有很大的带宽，但这会是由几个100MHz累积。我们假定TP拥有所有的CSI信息并可以互相交换这些信息。这篇论文的主要贡献如下：

- 提出了4个多小区HBF模型，并针对不同环境下的频谱效率进行了比较。
- 基于最大化信号泄露噪声比SLNR的小区间TP协作相较于无协作提升了67%的频谱效率，这里泄露是指为某个用户准备的信号意外地被其他用户收到，类似地，干扰是指其他TP的信号意外地被特定用户收到。当系统负担较小的时候，这种策略还能消除干扰。
- 在同一系统下（无电源控制），用户增加会导致频谱效率降低，这是因为用户间干扰。
- 在同一系统下，更小的小区半径可以增加频谱效率，这是因为更低的信号损失。

## 2 多小区系统布局和混合波束成型框架

我们考虑3个相邻的小区，每个有一个TP和多个（3到12）UE。

## 3 多小区多用户多流混合波束成型

论文介绍了TP和UE端的结构。然后给出了信号和频谱效率的公式

### 3.1 Baseline-无小区间协作

忽略干扰、TP之间无协作的情况。每个TP只有本地CSI。预编码方案采用本征模式传输（eigenmode transmission），RF预编码和合并按最大化信噪比设计。

### 3.2 减少泄露并最大化信号的预编码LSP

RF预编码器被设计为减轻泄露并增强想要的信号。

### 3.3 基于SLNR的预编码

最大化SINR是个很复杂的问题，因而SLNR就作为替代的优化目标。

### 3.4 泛化最大比GMR预编码

它与最大化SLNR有着相同的RF预编码、RF合并和基带合并过程。

### 3.5 迫零ZF预编码的可行性

ZF编码是很常见的。然而由于维数限制不可行。如果ZF在接收端实现则有可能，但这需要CSI在所有用户知道。

## 4 通道模型参数设置

有两种通道模型可以用于5G无线系统模拟，它们分别是3GPP和NYUSIM。

## 5 模拟结果和分析

### 5.1 $\mathbf{H}\mathbf{H}^H$的特征值

看不懂。

### 5.2 频谱效率

在3GPP和NYUSIM模型下，基于SLNR的HBF模型胜过了baseline和其他HBF模型，这体现了它抑制小区内和小区间干扰还有噪声的能力。而LSP在3GPP模型下没有超过baseline，这可能因为它花费了一些功率在减少泄露上，因而花费更少的功率在传输上。

SLNR和baseline都随着用户数增加，频谱效率有所下降。进一步分析显示信号功率变化不大，但干扰功率增大了。

随着小区半径增大，对所有的HBF方案，频谱效率下降了。

## 6 结论

数据显示基于SLNR的CoMP在大多数情况下提供了最大的频谱效率，因而很值得在毫米波网络中推广。LSP相较于baseline只有微弱的提升。ZF由于射频预编码和合并后有效信道矩阵乘积的秩不足而不可行。此外HBF方法会受小区半径、用户和流的数目影响。确切将，更小的半径和更少的用户可以增长频谱效率。
