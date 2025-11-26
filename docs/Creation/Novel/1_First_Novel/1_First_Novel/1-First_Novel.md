---
title: 第一本小说
date: 2025/11/06
password: 
  - 572106222bb8511a4b14e5029c9db7b9
  - 641ddf8c0d7b7d4d901fea0873a9fa62
---
![img](http://p6.qhimg.com/bdm/0_0_100/t0109fded7fe365a75e.jpg)

## 楔子

```
/*
 *      Copyright (c) 2018-2028, Chill Zhuang All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *  Redistributions in binary form must reproduce the above copyright
 *  notice, this list of conditions and the following disclaimer in the
 *  documentation and/or other materials provided with the distribution.
 *  Neither the name of the dreamlu.net developer nor the names of its
 *  contributors may be used to endorse or promote products derived from
 *  this software without specific prior written permission.
 *  Author: Chill 庄骞 (smallchill@163.com)
 */
package org.springblade.tpm.service.impl;


import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springblade.austin.feign.IAustinClient;
import org.springblade.core.mp.base.BaseServiceImpl;
import org.springblade.core.secure.BladeUser;
import org.springblade.core.tool.constant.BladeConstant;
import org.springblade.core.tool.utils.BeanUtil;
import org.springblade.core.tool.utils.Func;
import org.springblade.core.tool.utils.ObjectUtil;
import org.springblade.system.feign.IUserClient;
import org.springblade.tpm.domain.dto.AssetListDTO;
import org.springblade.tpm.domain.entity.*;
import org.springblade.tpm.domain.po.*;
import org.springblade.tpm.domain.vo.AssetListVO;
import org.springblade.tpm.mapper.AssetExFieldMapper;
import org.springblade.tpm.mapper.AssetListMapper;
import org.springblade.tpm.service.*;
import org.springblade.tpm.utils.EntityUtil;
import org.springblade.tpm.utils.StreamUtil;
import org.springblade.tpm.utils.TreeVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static org.springblade.tpm.constant.AssetListConstants.*;
import static org.springblade.tpm.constant.AssetListConstants.ASSET_STATE_CODE_IDLE;
import static org.springblade.tpm.constant.LineAssetAdaptCategory.ADAPT_ENABLE;
import static org.springblade.tpm.constant.NumConstants.NUM_NINETY;
import static org.springblade.tpm.constant.NumConstants.NUM_THIRTY;
import static org.springblade.tpm.constant.StatusCodeConstants.STATUS_CODE_OK;
import static org.springblade.tpm.constant.TpmConstants.FOUR_NUM_MAX;

/**
 * 资产台账 服务实现类
 *
 * @author BladeX
 * @since 2023-11-30
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssetListServiceImpl extends BaseServiceImpl<AssetListMapper, AssetListEntity> implements IAssetListService {

	private final ICategoryService categoryService;
	private final ISubCategoryService subCategoryService;
	private final IProcessCategoryService processCategoryService;
	private final IProcessSubCategoryService processSubCategoryService;
	private final IFunctionCodeService functionCodeService;
	private final AssetExFieldMapper assetExFieldMapper;
	private final AssetListMapper assetListMapper;
	private final IAssetExFieldService assetExFieldService;
	private final IAssetCycleParamService assetCycleParamService;
	private final IAssetStateCodeLogService assetStateCodeLogService;
	private final ILineAssetBomService lineAssetBomService;
	private final ILineAssetAdaptCategoryService lineAssetAdaptCategoryService;
	private final ICostCenterService costCenterService;
	private final IUserClient userClient;
	private final IAustinClient austinClient;
	private final RestTemplate restTemplate = new RestTemplate();
	private final IAssetMaterialService assetMaterialService;
	private static final String FORMAT_CODE = "0000";

	@Value("${sap.search-url}")
	private String searchUrl;

	@Value("${tpm.environment}")
	private String environment;

	@Override
	public IPage<AssetListVO> selectAssetListPage(IPage<AssetListVO> page, AssetListVO assetList) {
		return page.setRecords(baseMapper.selectAssetListPage(page, assetList,assetList.getAssetCodes()));
	}


	@Override
	public List<AssetListEntity> exportAssetList(List<Long> ids) {
		List<AssetListEntity> assetListList = baseMapper.selectBatchIds(ids);
		//assetListList.forEach(assetList -> {
		//	assetList.setTypeName(DictCache.getValue(DictEnum.YES_NO, AssetList.getType()));
		//});
		return assetListList;
	}

	@Override
	public List<TreeVO> tree(AssetListEntity assetList) {
		//1.获取数据列表,用于构建资产台账树型列表
		List<CategoryEntity> categoryEntityList = Optional.ofNullable(assetList.getCgCode())
			.map(cgCode -> categoryService.list(
				Wrappers.lambdaQuery(CategoryEntity.class)
					.eq(CategoryEntity::getCgCode, cgCode)))
			.orElseGet(categoryService::list);
		List<SubCategoryEntity> subCategoryEntityList = Optional.ofNullable(assetList.getScgCode())
			.map(scgCode -> subCategoryService.list(
				Wrappers.lambdaQuery(SubCategoryEntity.class).eq(SubCategoryEntity::getScgCode, scgCode)))
			.orElseGet(subCategoryService::list);
		List<ProcessCategoryEntity> processCategoryEntityList = Optional.ofNullable(assetList.getPcgCode())
			.map(pcgCode -> processCategoryService.list(
				Wrappers.lambdaQuery(ProcessCategoryEntity.class).eq(ProcessCategoryEntity::getPcgCode, pcgCode)))
			.orElseGet(processCategoryService::list);
		List<ProcessSubCategoryEntity> processSubCategoryEntityList = Optional.ofNullable(assetList.getPscgCode())
			.map(pscgCode -> processSubCategoryService.list(
				Wrappers.lambdaQuery(ProcessSubCategoryEntity.class).eq(ProcessSubCategoryEntity::getPscgCode, pscgCode)))
			.orElseGet(processSubCategoryService::list);
		List<FunctionCodeEntity> functionCodeEntityList = Optional.ofNullable(assetList.getFunCode())
			.map(funCode -> functionCodeService.list(
				Wrappers.lambdaQuery(FunctionCodeEntity.class).eq(FunctionCodeEntity::getFunCode, funCode)))
			.orElseGet(functionCodeService::list);

		//2.使用线程池并行处理数据构建树形结构
		return categoryEntityList.parallelStream()
			.filter(StreamUtil.distinctByKeys(CategoryEntity::getCgCode))
			.map(categoryEntity -> buildCategoryTree(categoryEntity, subCategoryEntityList, processCategoryEntityList, processSubCategoryEntityList, functionCodeEntityList))
			.collect(Collectors.toList());
	}

	/**
	 * 构建资产大类别树形结构
	 */
	private TreeVO buildCategoryTree(CategoryEntity categoryEntity, List<SubCategoryEntity> subCategoryEntityList, List<ProcessCategoryEntity> processCategoryEntityList, List<ProcessSubCategoryEntity> processSubCategoryEntityList, List<FunctionCodeEntity> functionCodeEntityList) {
		TreeVO categoryVO = new TreeVO();
		categoryVO.setId(categoryEntity.getId());
		categoryVO.setCode(categoryEntity.getCgCode());
		categoryVO.setName(categoryEntity.getCgName());
		categoryVO.setParentId(BladeConstant.TOP_PARENT_ID.toString());

		if (subCategoryEntityList != null) {
			List<TreeVO> subCategoryVOList = subCategoryEntityList.parallelStream()
				.filter(StreamUtil.distinctByKeys(SubCategoryEntity::getCgCode, SubCategoryEntity::getScgCode))
				.filter(subCategoryEntity -> subCategoryEntity.getCgCode().equals(categoryEntity.getCgCode()))
				.map(subCategoryEntity -> buildSubCategoryTree(subCategoryEntity, categoryVO.getCode(), processCategoryEntityList, processSubCategoryEntityList, functionCodeEntityList))
				.collect(Collectors.toList());
			categoryVO.setChildren(subCategoryVOList);
		}

		return categoryVO;
	}

	/**
	 * 构建资产小类别树型结构
	 */
	private TreeVO buildSubCategoryTree(SubCategoryEntity subCategoryEntity, String parentCode, List<ProcessCategoryEntity> processCategoryEntityList, List<ProcessSubCategoryEntity> processSubCategoryEntityList, List<FunctionCodeEntity> functionCodeEntityList) {
		TreeVO subCategoryVO = new TreeVO();
		subCategoryVO.setId(subCategoryEntity.getId());
		subCategoryVO.setCode(subCategoryEntity.getScgCode());
		subCategoryVO.setName(subCategoryEntity.getScgName());
		subCategoryVO.setParentId(parentCode);

		if (processCategoryEntityList != null) {
			List<TreeVO> processCategoryVOList = processCategoryEntityList.parallelStream()
				.filter(StreamUtil.distinctByKeys(ProcessCategoryEntity::getCgCode, ProcessCategoryEntity::getScgCode, ProcessCategoryEntity::getPcgCode))
				.filter(processCategoryEntity -> processCategoryEntity.getCgCode().equals(subCategoryEntity.getCgCode()) && processCategoryEntity.getScgCode().equals(subCategoryEntity.getScgCode()))
				.map(processCategoryEntity -> buildProcessCategoryTree(processCategoryEntity, subCategoryVO.getCode(), processSubCategoryEntityList, functionCodeEntityList))
				.collect(Collectors.toList());
			subCategoryVO.setChildren(processCategoryVOList);
		}

		return subCategoryVO;
	}

	/**
	 * 构建资产工艺类别树型结构
	 */
	private TreeVO buildProcessCategoryTree(ProcessCategoryEntity processCategoryEntity, String parentCode, List<ProcessSubCategoryEntity> processSubCategoryEntityList, List<FunctionCodeEntity> functionCodeEntityList) {
		TreeVO processCategoryVO = new TreeVO();
		processCategoryVO.setId(processCategoryEntity.getId());
		processCategoryVO.setCode(processCategoryEntity.getPcgCode());
		processCategoryVO.setName(processCategoryEntity.getPcgName());
		processCategoryVO.setParentId(parentCode);

		if (processSubCategoryEntityList != null) {
			List<TreeVO> processSubCategoryVOList = processSubCategoryEntityList.parallelStream()
				.filter(StreamUtil.distinctByKeys(ProcessSubCategoryEntity::getCgCode, ProcessSubCategoryEntity::getScgCode, ProcessSubCategoryEntity::getPcgCode, ProcessSubCategoryEntity::getPscgCode))
				.filter(processSubCategoryEntity -> processSubCategoryEntity.getCgCode().equals(processCategoryEntity.getCgCode())
					&& processSubCategoryEntity.getScgCode().equals(processCategoryEntity.getScgCode())
					&& processSubCategoryEntity.getPcgCode().equals(processCategoryEntity.getPcgCode()))
				.map(processSubCategoryEntity -> buildProcessSubCategoryTree(processSubCategoryEntity, processCategoryVO.getCode(), functionCodeEntityList))
				.collect(Collectors.toList());
			processCategoryVO.setChildren(processSubCategoryVOList);
		}

		return processCategoryVO;
	}

	/**
	 * 构建资产工艺小类别树型结构
	 */
	private TreeVO buildProcessSubCategoryTree(ProcessSubCategoryEntity processSubCategoryEntity, String parentCode, List<FunctionCodeEntity> functionCodeEntityList) {
		TreeVO processSubCategoryVO = new TreeVO();
		processSubCategoryVO.setId(processSubCategoryEntity.getId());
		processSubCategoryVO.setCode(processSubCategoryEntity.getPscgCode());
		processSubCategoryVO.setName(processSubCategoryEntity.getPscgName());
		processSubCategoryVO.setParentId(parentCode);

		if (functionCodeEntityList != null) {
			List<TreeVO> functionCodeVOList = functionCodeEntityList.parallelStream()
				.filter(StreamUtil.distinctByKeys(FunctionCodeEntity::getCgCode, FunctionCodeEntity::getScgCode, FunctionCodeEntity::getPcgCode, FunctionCodeEntity::getPscgCode, FunctionCodeEntity::getFunCode))
				.filter(functionCodeEntity -> functionCodeEntity.getCgCode().equals(processSubCategoryEntity.getCgCode())
					&& functionCodeEntity.getScgCode().equals(processSubCategoryEntity.getScgCode())
					&& functionCodeEntity.getPcgCode().equals(processSubCategoryEntity.getPcgCode())
					&& functionCodeEntity.getPscgCode().equals(processSubCategoryEntity.getPscgCode()))
				.map(functionCodeEntity -> {
					TreeVO functionCodeVO = new TreeVO();
					functionCodeVO.setId(functionCodeEntity.getId());
					functionCodeVO.setCode(functionCodeEntity.getFunCode());
					functionCodeVO.setName(functionCodeEntity.getFunName());
					functionCodeVO.setParentId(processSubCategoryVO.getCode());
					return functionCodeVO;
				})
				.collect(Collectors.toList());
			processSubCategoryVO.setChildren(functionCodeVOList);
		}

		return processSubCategoryVO;
	}


	@Override
	public boolean updateStatus(List<Long> ids, String assetStateCode) {
		return baseMapper.updateByIds(ids, assetStateCode);
	}

	@Override
	public boolean add(AssetListEntity assetList , BladeUser bladeUser) {
		//1.判断asset_list中是否具有相同的资产编号,用于防止重复添加
		AssetListEntity assetListEntity = this.getOne(
			Wrappers.lambdaQuery(AssetListEntity.class)
			.eq(AssetListEntity::getAssetCode, assetList.getAssetCode()));
		//2.判断资产编号是否已存在
		if (ObjectUtil.isNotEmpty(assetListEntity)) {
			throw new RuntimeException("该资产编号已存在，请重新输入");
		}
		//3.添加资产属性
		return this.save(assetList);
	}

	@Override
	public List<AssetListEntity> selectAssetList(List<String> assetCodeList) {
		return baseMapper.selectList(Wrappers.<AssetListEntity>lambdaQuery()
			.in(AssetListEntity::getAssetCode, assetCodeList));
	}

	@Override
	public List<AssetListEntity> selectAssets() {
		List<AssetListEntity> assetList = new ArrayList<>();

		assetListMapper.streamQueryData(assetListEntity -> {
			assetList.add(assetListEntity.getResultObject());
		});
		return assetList;
	}

	@Override
	public boolean acceptance(AssetOaEntity assetOaEntity) {
		//1、获取资产台账待验收资产
		List<AssetListEntity> assetList = this.list(Wrappers.<AssetListEntity>lambdaQuery()
			.eq(AssetListEntity::getStatus, 0));
		if (Func.isEmpty(assetList)) {
			log.error("获取资产台账待验收资产为空！！！");
		}
		//2、转为json字符串存入asset_oa表
		String jsonStr = JSONUtil.toJsonStr(assetList);
		assetOaEntity.setOaJson(jsonStr);
		//3、发起验收 完善资产验收信息
		return sendOaAcceptance(assetOaEntity);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean syncSap(AssetListEntity assetList) {
		//1、获取SAP入库信息(检索PO或入库单号)(获取入库固资物料+数量+资产流水号)
		List<AssetListEntity> sapInventory = getSapInventory(assetList);
		//2、生成资产台账信息(系统编制新资产编码，标识待验收)
		if (Func.isEmpty(sapInventory)) {
			log.error("获取SAP入库信息为空！！！");
		}
		Objects.requireNonNull(sapInventory)
			.forEach(assetListEntity -> assetListEntity.setStatus(0));
		//3、批量插入资产台账信息
		this.saveBatch(sapInventory);

        return false;
    }

	@Override
	public AssetListDTO detailByAssetCode(String assetCode) {
		//或者资产台账信息
		AssetListEntity assetListEntity = baseMapper.selectOne(Wrappers.lambdaQuery(AssetListEntity.class)
			.eq(AssetListEntity::getAssetCode, assetCode));
		//获取扩展信息
		List<AssetExFieldEntity> assetExFieldEntityList = assetExFieldService.list(Wrappers.lambdaQuery(AssetExFieldEntity.class)
			.eq(AssetExFieldEntity::getAssetCode, assetCode));
		//资产周期性参数
		List<AssetCycleParamEntity> assetCycleParamEntityList = assetCycleParamService.list(Wrappers.lambdaQuery(AssetCycleParamEntity.class)
			.eq(AssetCycleParamEntity::getAssetCode, assetCode));

		AssetListDTO assetListDTO = new AssetListDTO();
		BeanUtil.copy(assetListEntity, assetListDTO);
		assetListDTO.setAssetExFieldEntityList(assetExFieldEntityList);
		assetListDTO.setAssetCycleParamEntityList(assetCycleParamEntityList);
		return assetListDTO;
	}

    @Override
    public List<AssetExFieldEntity> getAssetListEx(AssetListExPo assetListExPo) {
		//1.首先根据资产类别条件查询资产台账信息
		List<AssetListEntity> assetListEntityList = baseMapper.selectList(Wrappers.lambdaQuery(AssetListEntity.class)
			.eq(ObjectUtil.isNotEmpty(assetListExPo.getCgCode()), AssetListEntity::getCgCode, assetListExPo.getCgCode())
			.eq(ObjectUtil.isNotEmpty(assetListExPo.getScgCode()), AssetListEntity::getScgCode, assetListExPo.getScgCode())
			.eq(ObjectUtil.isNotEmpty(assetListExPo.getPcgCode()), AssetListEntity::getPcgCode, assetListExPo.getPcgCode())
			.eq(ObjectUtil.isNotEmpty(assetListExPo.getPscgCode()), AssetListEntity::getPscgCode, assetListExPo.getPscgCode())
			.eq(ObjectUtil.isNotEmpty(assetListExPo.getFunCode()), AssetListEntity::getFunCode, assetListExPo.getFunCode()));
		//1.1判空
		if (Func.isEmpty(assetListEntityList)) {
			return Collections.emptyList();
		}

		//2.提取资产编码集合
		List<String> assetCodes = assetListEntityList.stream().map(AssetListEntity::getAssetCode).distinct().collect(Collectors.toList());

		//3.根据资产编码集合查询资产扩展属性列表
		return assetExFieldService.list(Wrappers.lambdaQuery(AssetExFieldEntity.class)
				.eq(ObjectUtil.isNotEmpty(assetListExPo.getTmplCode()), AssetExFieldEntity::getTmplCode, assetListExPo.getTmplCode())
				.eq(ObjectUtil.isNotEmpty(assetListExPo.getFieldName()), AssetExFieldEntity::getFieldName, assetListExPo.getFieldName())
			.in(AssetExFieldEntity::getAssetCode, assetCodes));
    }

	@Override
	public List<AssetListEntity> queryAssetList(AssetListVO assetListVO) {
		return baseMapper.queryAssetList(assetListVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean updateAssetStateCodeByThreeInfo(BladeUser bladeUser) {
		//1.查询所有状态为“待用”的资产，且满足指定分类规则
		//查询出产线设备资适配类别
		List<String> assetCategoryList = lineAssetAdaptCategoryService.list(
				Wrappers.lambdaQuery(LineAssetAdaptCategoryEntity.class)
					.eq(LineAssetAdaptCategoryEntity::getAdapt,ADAPT_ENABLE))
			.stream()
			.map(LineAssetAdaptCategoryEntity::getAssetCategory)
			.distinct()
			.collect(Collectors.toList());
		if (ObjectUtil.isEmpty(assetCategoryList)) {
			return true;
		}
		// 构建查询条件
		LambdaQueryWrapper<AssetListEntity> queryWrapper = Wrappers.lambdaQuery(AssetListEntity.class)
			.eq(AssetListEntity::getAssetStateCode, ASSET_STATE_CODE_TO_BE_USED).and(wrapper -> {
			assetCategoryList.forEach(category -> wrapper.or().likeRight(AssetListEntity::getAssetCode, category));
		});
		// 执行查询
		List<AssetListEntity> assetListEntityList = this.list(queryWrapper);

		//2.如果没有符合条件的资产，直接返回 true 表示处理完成
		if (Func.isEmpty(assetListEntityList)) {
			return true;
		}

		//3.构建 Map: assetCode -> 日志列表
		Map<String, List<AssetStateCodeLogEntity>> logMap = assetStateCodeLogService.list(
			Wrappers.lambdaQuery(AssetStateCodeLogEntity.class)
				.apply("asset_code regexp '^A01|^A02|^A03|^A05|^B11|^D|^E'"))
			.stream()
			.collect(Collectors.groupingBy(AssetStateCodeLogEntity::getAssetCode));

		//4.准备两个列表：用于批量更新资产状态 & 新增状态变更日志
		List<AssetListEntity> updateAssetList = Collections.synchronizedList(new ArrayList<>());
		List<AssetStateCodeLogEntity> saveLogList = Collections.synchronizedList(new ArrayList<>());

		//5.遍历每个资产并处理
		assetListEntityList.parallelStream()
			.forEach(assetListEntity -> processAsset(assetListEntity, logMap, bladeUser, updateAssetList, saveLogList));

		// 6. 批量更新资产表和日志表（需你的 service 支持批量操作）
		return this.updateBatchById(updateAssetList)&& assetStateCodeLogService.saveBatch(saveLogList);
	}

	@Override
	public boolean updateAssetStateCodeByThreeOne(BladeUser bladeUser) {
		//1.首先获取所有资产状态为4维修5保养6校准的资产
		//查询出产线设备资适配类别
		List<String> assetCategoryList = lineAssetAdaptCategoryService.list(
				Wrappers.lambdaQuery(LineAssetAdaptCategoryEntity.class)
					.eq(LineAssetAdaptCategoryEntity::getAdapt,ADAPT_ENABLE))
			.stream()
			.map(LineAssetAdaptCategoryEntity::getAssetCategory)
			.distinct()
			.collect(Collectors.toList());
		if (ObjectUtil.isEmpty(assetCategoryList)) {
			return true;
		}
		// 构建查询条件
		LambdaQueryWrapper<AssetListEntity> queryWrapper = Wrappers.lambdaQuery(AssetListEntity.class)
			.in(AssetListEntity::getAssetStateCode, Arrays.asList(
				ASSET_STATE_CODE_REPAIR,
				ASSET_STATE_CODE_MAINTENANCE,
				ASSET_STATE_CODE_CALIBRATION)).and(wrapper -> {
				assetCategoryList.forEach(category -> wrapper.or().likeRight(AssetListEntity::getAssetCode, category));
			});
		// 执行查询
		List<AssetListEntity> assetListEntityList = this.list(queryWrapper);

		// 2. 获取所有资产编码
		List<String> assetCodes = assetListEntityList.stream()
			.map(AssetListEntity::getAssetCode)
			.collect(Collectors.toList());

		if (Func.isEmpty(assetListEntityList)) {
			return true;
		}

		// 3. 构建 Map: assetCode -> 日志列表
		Map<String, List<AssetStateCodeLogEntity>> logMap = assetStateCodeLogService.list(Wrappers.lambdaQuery(AssetStateCodeLogEntity.class)
				.in(AssetStateCodeLogEntity::getAssetCode, assetCodes)).stream()
			.collect(Collectors.groupingBy(AssetStateCodeLogEntity::getAssetCode));

		// 4. 准备两个 list 缓存用于后续批量删除
		List<String> deleteAssetCoderList = new ArrayList<>();

		// 5. 遍历资产列表
		assetListEntityList.forEach(assetListEntity -> {
			String assetCode = assetListEntity.getAssetCode();
			List<AssetStateCodeLogEntity> list = logMap.getOrDefault(assetCode, Collections.emptyList());
			if (CollUtil.isNotEmpty(list)) {
				// 排序一次
				list.sort(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));
				// 找到最新的记录
				Optional<AssetStateCodeLogEntity> latestLogOptional = list.stream()
					.max(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));
				// 如果找到了符合条件的记录
				if (latestLogOptional.isPresent()) {
					Date createTimeOne = latestLogOptional.get().getCreateTime();
					LocalDate createDate = createTimeOne.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
					LocalDate now = LocalDate.now();
					long daysDifference = ChronoUnit.DAYS.between(createDate, now);
					if (daysDifference > NUM_THIRTY) {
						deleteAssetCoderList.add(assetListEntity.getAssetCode());
					}
				}
			}
		});

		if (ObjectUtil.isEmpty(deleteAssetCoderList)) {
			return true;
		}

		// 6.找出LineAssetBom中删除的资产编码
		List<LineAssetBomEntity> lineAssetBomEntityList = lineAssetBomService.list(Wrappers.lambdaQuery(LineAssetBomEntity.class)
			.in(LineAssetBomEntity::getAssetCode, deleteAssetCoderList));

		// 提取这些记录的ID列表
		List<Long> idsToDelete = lineAssetBomEntityList.stream()
			.map(LineAssetBomEntity::getId)
			// 假设getId()方法返回的是记录的主键
			.collect(Collectors.toList());

		// 使用ID列表批量删除记录
		return lineAssetBomService.removeByIds(idsToDelete);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public boolean updateByAssetList(AssetListEntity assetList, BladeUser user) {
		//1.注入当前用户信息
		Optional<BladeUser> bladeUserOptional = Optional.ofNullable(user);
		bladeUserOptional.ifPresent(bladeUser -> {
			assetList.setModifyMan(bladeUser.getUserName());
			EntityUtil.setCreateAndUpdateInfo(assetList, bladeUser, 1L);
		});
		//更新
		boolean update = this.updateById(assetList);
		List<AssetExFieldEntity> assetExFieldEntityList = assetList.getAssetExFieldEntityList();
		if (CollUtil.isEmpty(assetExFieldEntityList)) {
			return update;
		}
		//2.过滤出存在id的为需更新的资产拓展属性并注入当前用户信息
		List<AssetExFieldEntity> toUpdateList = assetExFieldEntityList.stream()
			.filter(assetExField -> ObjectUtil.isNotEmpty(assetExField.getId()))
			.peek(assetFile -> bladeUserOptional.ifPresent(bladeUser -> {
				assetFile.setModifyMan(bladeUser.getUserName());
				EntityUtil.setCreateAndUpdateInfo(assetFile, bladeUser, 1L);
			}))
			.collect(Collectors.toList());
		//3.过滤出不存在id的为需新增的资产拓展属性并注入当前用户信息
		List<AssetExFieldEntity> toInsertList = assetExFieldEntityList.stream()
			.filter(assetExField -> ObjectUtil.isEmpty(assetExField.getId()))
			.peek(assetFile -> bladeUserOptional.ifPresent(bladeUser -> {
				assetFile.setCreateMan(bladeUser.getUserName());
				assetFile.setModifyMan(bladeUser.getUserName());
				EntityUtil.setCreateAndUpdateInfo(assetFile, bladeUser, 0L);
			}))
			.collect(Collectors.toList());

		//4.执行批量更新操作
		assetExFieldService.updateBatchById(toUpdateList);
		//5.执行批量新增操作
		assetExFieldService.saveBatch(toInsertList);
		return update;
	}

	@Override
	public List<AssetListVO> getAssetList(AssetListVO assetList) {
		return baseMapper.getAssetList(assetList, assetList.getAssetCodes());
	}

	@Override
	public List<SapAssetPO> getSapInfo(List<Map<String,String>> list) {
		SapPO sapPo = new SapPO();
		sapPo.setAshxName("SAP/SapRFC.ashx");
		sapPo.setActionName("ashxSapRfc");
		ClientParameterobject clientParameterobject = new ClientParameterobject();
		clientParameterobject.setRfcName("ZFI_RFC_AS03");
		IN_ITAB<Map<String,String>> in_itab = new IN_ITAB();
		in_itab.setIN_ITAB(list);
		clientParameterobject.setTableParams(in_itab);
		sapPo.setClientParameterobject(clientParameterobject);

		String jsonData = JSONUtil.toJsonStr(sapPo);
		HttpURLConnection connection = null;
		try {
			// Create URL object
			URL urlObject = new URL(searchUrl);
			connection = (HttpURLConnection) urlObject.openConnection();
			connection.setRequestMethod("POST");
			connection.setRequestProperty("Authorization", "Basic TXlBc2h4Q2xpZW50Okh6LTk2MzMrWz8/P10=");
			connection.setRequestProperty("Data-Type", "WebApi");
			connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
			connection.setDoOutput(true);
			connection.setDoInput(true);

			byte[] sendData = jsonData.getBytes(StandardCharsets.UTF_8);
			try (OutputStream outputStream = connection.getOutputStream()) {
				outputStream.write(sendData);
			}

			int responseCode = connection.getResponseCode();
			if (responseCode != HttpURLConnection.HTTP_OK) {
				throw new RuntimeException("Failed : HTTP error code : " + responseCode);
			}

			try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
				StringBuilder response = new StringBuilder();
				String line;
				while ((line = reader.readLine()) != null) {
					response.append(line);
				}
				System.out.println("Response: " + response.toString());

				// 解析响应数据
				JSONObject jsonObject = JSON.parseObject(response.toString());

				// 初始化返回列表
				List<SapAssetPO> sapAssetPoList = new ArrayList<>();

				// 获取 Data 下的 ResponseTableParams 对象
				JSONObject responseTableParams = jsonObject.getJSONObject("Data")
					.getJSONObject("ResponseTableParams");
				// 获取 OUT_RESULT 对象
				// 获取 OUT_RESULT 数组
				JSONArray outResultArray = responseTableParams.getJSONArray("OUT_ITAB");

				// 遍历 OUT_RESULT 数组并获取 TYPE 的值
				for (int i = 0; i < outResultArray.size(); i++) {
					SapAssetPO sapAssetPO = new SapAssetPO();
					JSONObject item = outResultArray.getJSONObject(i);
					String bukrs = item.getString("BUKRS");
					String anln1 = item.getString("ANLN1");
					String invnr = item.getString("INVNR");
					String deakt = item.getString("DEAKT");
					String txt50 = item.getString("TXT50");
					String s = "0000-00-00";
					if (s.equals(deakt)) {
						sapAssetPO.setBUKRS(bukrs);
						sapAssetPO.setANLN1(anln1);
						sapAssetPO.setINVNR(invnr);
						sapAssetPO.setDEAKT(deakt);
						sapAssetPO.setTXT50(txt50);
						sapAssetPoList.add(sapAssetPO);
					}
				}

				// 这里可以根据需要进一步处理jsonObject 返回JSON字符串
				return sapAssetPoList;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}


	@Override
	public List<AssetListEntity> listByCenterCode(List<String> assetFinanceStateCodeList) {
		return baseMapper.listByCenterCode(assetFinanceStateCodeList);
	}

    @Override
    public boolean batchSaveAccept(BladeUser bladeUser) {
		//1.创建响应
		HttpHeaders requestHeaders = new HttpHeaders();
		requestHeaders.setContentType(MediaType.APPLICATION_JSON);
		requestHeaders.set("Authorization", "Basic TXlBc2h4Q2xpZW50Okh6LTk2MzMrWz8/P10=");
		requestHeaders.set("Data-Type", "WebApi");

		//2.构建参数
		HttpEntity<Map<String, Object>> requestRequestEntity = getMapHttpEntity(requestHeaders);

		//3.发送Post请求
		ResponseEntity<String> requestResponse = restTemplate.postForEntity(searchUrl, requestRequestEntity, String.class);

		//4.解析
		//4.1.获取原始响应体
		String body = requestResponse.getBody();
		if (body == null || body.trim().isEmpty()) {
			throw new RuntimeException("SAP RFC 返回空响应");
		}

		//4.2.解析 JSON
		JSONObject root;
		try {
			root = JSON.parseObject(body);
		} catch (Exception e) {
			throw new RuntimeException("JSON 解析失败，响应内容: " + body, e);
		}

		//4.3.检查状态和消息
		String msg = root.getString("MSG");

		//如果 Status 是 "EX" 或 MSG 不是 "OK"，视为失败
		if (!STATUS_CODE_OK.equals(msg)) {
			throw new RuntimeException("SAP RFC 调用失败: " + msg);
		}

		//4.4.获取 Data
		JSONObject data = root.getJSONObject("Data");
		if (data == null) {
			throw new RuntimeException("SAP RFC 返回缺少 Data 字段");
		}

		//4.5.获取 ResponseTableParams
		JSONObject responseTableParams = data.getJSONObject("ResponseTableParams");
		if (responseTableParams == null) {
			throw new RuntimeException("SAP RFC 返回缺少 ResponseTableParams");
		}

		//4.6.获取 IT_DATA 数组
		JSONArray itDataArray = responseTableParams.getJSONArray("IT_DATA");
		if (itDataArray == null || itDataArray.isEmpty()) {
			throw new RuntimeException("未查询到入库单数据（IT_DATA 为空）");
		}

		//4.7.转换为 Java 对象列表
		List<AcceptAssetListPO> acceptAssetList = itDataArray.toJavaList(AcceptAssetListPO.class);

		//5.查询所有资产物料编码
		List<String> materialNumberList = assetMaterialService.list()
			.stream()
			.map(AssetMaterialEntity::getAssetMtlCode)
			.distinct()
			.collect(Collectors.toList());

		//1.首先创建每日初始流水号
		int initialCount = 1;
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_CODE);
		//1.2.格式化为四位流水号 code: 0001
		String initialSerialNumber = decimalFormat.format(initialCount);

		acceptAssetList.stream()
			.filter(acceptAssetListPo -> materialNumberList.contains(acceptAssetListPo.getMaterialNumber()) &&
				Character.getNumericValue(acceptAssetListPo.getQuantity().charAt(0))>=1)
			.forEach(acceptAssetListPo -> {
				String initialAssetCode = acceptAssetListPo.getMaterialNumber() + initialSerialNumber;
				for (int i = 0; i < Character.getNumericValue(acceptAssetListPo.getQuantity().charAt(0)); i++) {
					String assetCode = generateFallbackAssetCode(acceptAssetListPo.getMaterialNumber(), decimalFormat, initialAssetCode);
					AssetListEntity assetListEntity = new AssetListEntity();
					assetListEntity.setAssetCode(assetCode);
					assetListEntity.setAssetStateCode(ASSET_STATE_CODE_TO_BE_USED);
					assetListEntity.setAssetFinanceStateCode(ASSET_FINANCE_WAIT_ACCEPTANCE);
					assetListEntity.setAssetType(ASSET_TYPE_FIXED);
					assetListEntity.setPoNo(acceptAssetListPo.getPurchaseOrderNumber());
					AssetMaterialEntity materialEntity = assetMaterialService.getOne(Wrappers.lambdaQuery(AssetMaterialEntity.class)
						.eq(AssetMaterialEntity::getAssetMtlCode, acceptAssetListPo.getMaterialNumber()));
					assetListEntity.setCgCode(materialEntity.getCgCode());
					assetListEntity.setScgCode(materialEntity.getScgCode());
					assetListEntity.setPcgCode(materialEntity.getPcgCode());
					assetListEntity.setPscgCode(materialEntity.getPscgCode());
					assetListEntity.setFunCode(materialEntity.getFunCode());
					assetListEntity.setFinCode(materialEntity.getFinCode());
					Optional.ofNullable(bladeUser)
						.ifPresent(user -> {
							assetListEntity.setCreateMan(bladeUser.getUserName());
							assetListEntity.setModifyMan(bladeUser.getUserName());
							EntityUtil.setCreateAndUpdateInfo(assetListEntity, bladeUser, 0L);
						});
					this.save(assetListEntity);
				}
			});

		return true;
    }

	@Override
	public String generateAssetCode(AssetListEntity assetListEntity) {
		//1.首先创建每日初始流水号
		int initialCount = 1;
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_CODE);
		//1.2.格式化为四位流水号 code: 0001
		String initialSerialNumber = decimalFormat.format(initialCount);

		//2.获取资产类别并拼接
		String assetClass = getAssetClass(assetListEntity);

		//3.拼接资产类别和流水号,初始化资产编码
		String initialAssetCode = assetClass + initialSerialNumber;

		return generateFallbackAssetCode(assetClass, decimalFormat, initialAssetCode);
	}

	private static @NotNull HttpEntity<Map<String, Object>> getMapHttpEntity(HttpHeaders requestHeaders) {
		Map<String, Object> requestBody = new HashMap<>(10);
		requestBody.put("AshxName", "SAP/SapRfc.ashx");
		requestBody.put("ActionName", "ashxSapRfc");

		Map<String, Object> clientParamMap = new HashMap<>(10);
		clientParamMap.put("RfcName", "ZTPM_DATA_004");

		Map<String, Object> inputParamsMap = new HashMap<>(10);
		inputParamsMap.put("B_DATUM", "20250121");
		inputParamsMap.put("E_DATUM", "20251121");
		clientParamMap.put("InputParams", inputParamsMap);
		requestBody.put("ClientParameterObject", clientParamMap);

		return new HttpEntity<>(requestBody, requestHeaders);
	}

	private List<AssetListEntity> getSapInventory(AssetListEntity assetList) {
		log.info("获取SAP入库信息");
		return null;
	}

	/**
	 * 发起oa资产验收
	 * @param assetOaEntity AssetOaEntity
	 * @return boolean
	 */
	private boolean sendOaAcceptance(AssetOaEntity assetOaEntity) {
		log.info("发起验收");
		return false;
	}

	/**
	 * updateAssetStateCodeByThreeInfo
	 * 5.遍历每个资产并处理
	 */
	private void processAsset(AssetListEntity assetListEntity,
							  Map<String, List<AssetStateCodeLogEntity>> logMap,
							  BladeUser bladeUser,
							  List<AssetListEntity> updateAssetList,
							  List<AssetStateCodeLogEntity> saveLogList) {

		//1.获取资产编码
		String assetCode = assetListEntity.getAssetCode();
		List<AssetStateCodeLogEntity> list = logMap.getOrDefault(assetCode, Collections.emptyList());

		//2.如果日志为空，直接跳过并记录错误
		if (CollUtil.isEmpty(list)) {
			log.error("资产 [{}] 无状态变更日志", assetCode);
			return;
		}

		//2.排序一次,根据创建时间升序排列
		list.sort(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));

		//3.判断是否存在“在用”的状态
		boolean hasInUse = list.stream().anyMatch(log -> ASSET_STATE_CODE_IN_USE.equals(log.getAssetStateCode()));

		Optional<AssetStateCodeLogEntity> targetLogOptional = Optional.empty();

		if (hasInUse) {
			// 存在“在用”的状态：找到最近的“在用”记录
			Optional<AssetStateCodeLogEntity> latestInUse = list.stream()
				.filter(log -> ASSET_STATE_CODE_IN_USE.equals(log.getAssetStateCode()))
				.max(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));

			if (latestInUse.isPresent()) {
				Date createTime = latestInUse.get().getCreateTime();

				// 找到该时间之后最早的“待用”记录
				targetLogOptional = list.stream()
					.filter(log -> ASSET_STATE_CODE_TO_BE_USED.equals(log.getAssetStateCode()))
					.filter(log -> createTime.before(log.getCreateTime()))
					.min(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));
			}
		} else {
			// 不存在“在用”的状态：找最早的一条“待用”记录
			targetLogOptional = list.stream()
				.filter(log -> ASSET_STATE_CODE_TO_BE_USED.equals(log.getAssetStateCode()))
				.min(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));
		}

		// 如果找到了符合条件的记录
		if (targetLogOptional.isPresent()) {
			Date createTimeOne = targetLogOptional.get().getCreateTime();
			LocalDate createDate = createTimeOne.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			LocalDate now = LocalDate.now();
			long daysDifference = ChronoUnit.DAYS.between(createDate, now);

			if (daysDifference > NUM_NINETY) {
				// 设置为闲置
				assetListEntity.setAssetStateCode(ASSET_STATE_CODE_IDLE);
				EntityUtil.setCreateAndUpdateInfo(assetListEntity, bladeUser, 1L);
				assetListEntity.setModifyMan(bladeUser.getUserName());
				updateAssetList.add(assetListEntity);

				// 新增状态变更日志
				AssetStateCodeLogEntity logEntity = new AssetStateCodeLogEntity();
				logEntity.setAssetCode(assetCode);
				logEntity.setAssetStateCode(ASSET_STATE_CODE_IDLE);
				logEntity.setAssetFinanceStateCode(assetListEntity.getAssetFinanceStateCode());
				logEntity.setCreateMan(bladeUser.getUserName());
				logEntity.setModifyMan(bladeUser.getUserName());
				EntityUtil.setCreateAndUpdateInfo(logEntity, bladeUser, 0L);
				saveLogList.add(logEntity);
			}
		}
	}

	private String getAssetClass(AssetListEntity assetListEntity) {
		return assetListEntity.getCgCode() +
			assetListEntity.getScgCode() +
			assetListEntity.getPcgCode() +
			assetListEntity.getPscgCode() +
			assetListEntity.getFunCode() +
			assetListEntity.getFinCode();
	}

	private String generateFallbackAssetCode(String assetClass ,DecimalFormat decimalFormat ,String initialAssetCode) {
		//4.查询数据库中该资产类别的最大流水号
		Optional<String> maxAssetCodeOptional = this.list(
				Wrappers.<AssetListEntity>lambdaQuery()
					.likeRight(AssetListEntity::getAssetCode, assetClass))
			.stream()
			.map(AssetListEntity::getAssetCode)
			.filter(Objects::nonNull)
			.max(Comparator.naturalOrder());

		//5.判断数据库中该资产类别的最大流水号是否为空
		if (maxAssetCodeOptional.isPresent()) {
			String maxAssetCode = maxAssetCodeOptional.get();
			//5.1.判断流水号是否已满
			if ((assetClass + FOUR_NUM_MAX).equals(maxAssetCode)) {
				throw new RuntimeException("该资产类别 " + assetClass + " 流水号已满");
			}
			//5.2.提取流水号部分
			String maxSerialNumberStr = maxAssetCode.substring(assetClass.length());
			BigInteger maxSerialNumber = new BigInteger(maxSerialNumberStr);
			BigInteger nextSerialNumber = maxSerialNumber.add(BigInteger.ONE);
			String nextSerialNumberStr = decimalFormat.format(nextSerialNumber);
			//6.返回下一个资产编码
			return assetClass + nextSerialNumberStr;
		}
		//6.返回初始资产编码
		return initialAssetCode;
	}

	@Transactional(rollbackFor = Exception.class)
	public boolean batchCreateAssetCodes(List<AcceptAssetListPO> acceptAssetList, List<String> materialNumberList, BladeUser bladeUser) {
		// 1. 过滤出有效数据，并按物料编号分组（便于后续按物料批量处理流水号）
		Map<String, List<AcceptAssetListPO>> groupedByMaterial = acceptAssetList.stream()
			.filter(po -> materialNumberList.contains(po.getMaterialNumber())
				&& Character.isDigit(po.getQuantity().charAt(0))
				&& Character.getNumericValue(po.getQuantity().charAt(0)) >= 1)
			.collect(Collectors.groupingBy(AcceptAssetListPO::getMaterialNumber));

		// 2. 获取每个物料类别当前的最大流水号（只查一次/物料）
		Map<String, Integer> currentMaxSerialMap = new HashMap<>(10);
		for (String materialNumber : groupedByMaterial.keySet()) {
			Optional<String> maxCodeOpt = this.list(
					Wrappers.<AssetListEntity>lambdaQuery()
						.likeRight(AssetListEntity::getAssetCode, materialNumber))
				.stream()
				.map(AssetListEntity::getAssetCode)
				.filter(Objects::nonNull)
				.max(Comparator.naturalOrder());

			if (maxCodeOpt.isPresent()) {
				String maxCode = maxCodeOpt.get();
				if ((materialNumber + FOUR_NUM_MAX).equals(maxCode)) {
					throw new RuntimeException("该资产类别 " + materialNumber + " 流水号已满");
				}
				String serialPart = maxCode.substring(materialNumber.length());
				currentMaxSerialMap.put(materialNumber, Integer.parseInt(serialPart));
			} else {
				// 初始为0，下一条从1开始
				currentMaxSerialMap.put(materialNumber, 0);
			}
		}

		// 3. 构建所有 AssetListEntity // 假设 FORMAT_CODE = "0000"
		List<AssetListEntity> entitiesToSave = new ArrayList<>();
		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_CODE);

		for (Map.Entry<String, List<AcceptAssetListPO>> entry : groupedByMaterial.entrySet()) {
			String materialNumber = entry.getKey();
			List<AcceptAssetListPO> poList = entry.getValue();

			int currentSerial = currentMaxSerialMap.get(materialNumber);

			for (AcceptAssetListPO po : poList) {
				int quantity = Character.getNumericValue(po.getQuantity().charAt(0));
				for (int i = 0; i < quantity; i++) {
					currentSerial++; // 自增流水号
					String assetCode = materialNumber + decimalFormat.format(currentSerial);

					AssetListEntity entity = new AssetListEntity();
					entity.setAssetCode(assetCode);
					entity.setAssetStateCode(ASSET_STATE_CODE_TO_BE_USED);
					entity.setAssetFinanceStateCode(ASSET_FINANCE_WAIT_ACCEPTANCE);
					entity.setAssetType(ASSET_TYPE_FIXED);
					entity.setPoNo(po.getPurchaseOrderNumber());

					// 获取物料分类信息（建议提前批量查询，避免N+1）
					AssetMaterialEntity materialEntity = assetMaterialService.getOne(
						Wrappers.lambdaQuery(AssetMaterialEntity.class)
							.eq(AssetMaterialEntity::getAssetMtlCode, materialNumber)
					);
					if (materialEntity != null) {
						entity.setCgCode(materialEntity.getCgCode());
						entity.setScgCode(materialEntity.getScgCode());
						entity.setPcgCode(materialEntity.getPcgCode());
						entity.setPscgCode(materialEntity.getPscgCode());
						entity.setFunCode(materialEntity.getFunCode());
						entity.setFinCode(materialEntity.getFinCode());
					}

					if (bladeUser != null) {
						entity.setCreateMan(bladeUser.getUserName());
						entity.setModifyMan(bladeUser.getUserName());
						EntityUtil.setCreateAndUpdateInfo(entity, bladeUser, 0L);
					}

					entitiesToSave.add(entity);
				}
			}

			// 更新该物料的最新流水号（用于下一个批次，如果需要持久化可存入缓存或表）
			currentMaxSerialMap.put(materialNumber, currentSerial);
		}

		System.out.println("entitiesToSave: " + entitiesToSave);

		// 4. 批量保存
		if (!entitiesToSave.isEmpty()) {
			//return this.saveBatch(entitiesToSave);
		}
		return false;
	}


}

```

























































































































































































































































