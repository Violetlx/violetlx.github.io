import{_ as n,c as e,b as t,o as i}from"./app-BEDUYAp_.js";const a={};function l(c,s){return i(),e("div",null,[...s[0]||(s[0]=[t(`<p><img src="http://p6.qhimg.com/bdm/0_0_100/t0109fded7fe365a75e.jpg" alt="img"></p><h2 id="楔子" tabindex="-1"><a class="header-anchor" href="#楔子"><span>楔子</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">/*</span>
<span class="line"> *      Copyright (c) 2018-2028, Chill Zhuang All rights reserved.</span>
<span class="line"> *</span>
<span class="line"> *  Redistribution and use in source and binary forms, with or without</span>
<span class="line"> *  modification, are permitted provided that the following conditions are met:</span>
<span class="line"> *</span>
<span class="line"> *  Redistributions of source code must retain the above copyright notice,</span>
<span class="line"> *  this list of conditions and the following disclaimer.</span>
<span class="line"> *  Redistributions in binary form must reproduce the above copyright</span>
<span class="line"> *  notice, this list of conditions and the following disclaimer in the</span>
<span class="line"> *  documentation and/or other materials provided with the distribution.</span>
<span class="line"> *  Neither the name of the dreamlu.net developer nor the names of its</span>
<span class="line"> *  contributors may be used to endorse or promote products derived from</span>
<span class="line"> *  this software without specific prior written permission.</span>
<span class="line"> *  Author: Chill 庄骞 (smallchill@163.com)</span>
<span class="line"> */</span>
<span class="line">package org.springblade.tpm.service.impl;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">import cn.hutool.core.collection.CollUtil;</span>
<span class="line">import cn.hutool.json.JSONUtil;</span>
<span class="line">import com.alibaba.fastjson.JSON;</span>
<span class="line">import com.alibaba.fastjson.JSONArray;</span>
<span class="line">import com.alibaba.fastjson.JSONObject;</span>
<span class="line">import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;</span>
<span class="line">import com.baomidou.mybatisplus.core.metadata.IPage;</span>
<span class="line">import com.baomidou.mybatisplus.core.toolkit.Wrappers;</span>
<span class="line">import lombok.RequiredArgsConstructor;</span>
<span class="line">import lombok.extern.slf4j.Slf4j;</span>
<span class="line">import org.jetbrains.annotations.NotNull;</span>
<span class="line">import org.springblade.austin.feign.IAustinClient;</span>
<span class="line">import org.springblade.core.mp.base.BaseServiceImpl;</span>
<span class="line">import org.springblade.core.secure.BladeUser;</span>
<span class="line">import org.springblade.core.tool.constant.BladeConstant;</span>
<span class="line">import org.springblade.core.tool.utils.BeanUtil;</span>
<span class="line">import org.springblade.core.tool.utils.Func;</span>
<span class="line">import org.springblade.core.tool.utils.ObjectUtil;</span>
<span class="line">import org.springblade.system.feign.IUserClient;</span>
<span class="line">import org.springblade.tpm.domain.dto.AssetListDTO;</span>
<span class="line">import org.springblade.tpm.domain.entity.*;</span>
<span class="line">import org.springblade.tpm.domain.po.*;</span>
<span class="line">import org.springblade.tpm.domain.vo.AssetListVO;</span>
<span class="line">import org.springblade.tpm.mapper.AssetExFieldMapper;</span>
<span class="line">import org.springblade.tpm.mapper.AssetListMapper;</span>
<span class="line">import org.springblade.tpm.service.*;</span>
<span class="line">import org.springblade.tpm.utils.EntityUtil;</span>
<span class="line">import org.springblade.tpm.utils.StreamUtil;</span>
<span class="line">import org.springblade.tpm.utils.TreeVO;</span>
<span class="line">import org.springframework.beans.factory.annotation.Value;</span>
<span class="line">import org.springframework.http.HttpEntity;</span>
<span class="line">import org.springframework.http.HttpHeaders;</span>
<span class="line">import org.springframework.http.MediaType;</span>
<span class="line">import org.springframework.http.ResponseEntity;</span>
<span class="line">import org.springframework.stereotype.Service;</span>
<span class="line">import org.springframework.transaction.annotation.Transactional;</span>
<span class="line">import org.springframework.web.client.RestTemplate;</span>
<span class="line"></span>
<span class="line">import java.io.BufferedReader;</span>
<span class="line">import java.io.InputStreamReader;</span>
<span class="line">import java.io.OutputStream;</span>
<span class="line">import java.math.BigInteger;</span>
<span class="line">import java.net.HttpURLConnection;</span>
<span class="line">import java.net.URL;</span>
<span class="line">import java.nio.charset.StandardCharsets;</span>
<span class="line">import java.text.DecimalFormat;</span>
<span class="line">import java.time.LocalDate;</span>
<span class="line">import java.time.ZoneId;</span>
<span class="line">import java.time.temporal.ChronoUnit;</span>
<span class="line">import java.util.*;</span>
<span class="line">import java.util.stream.Collectors;</span>
<span class="line"></span>
<span class="line">import static org.springblade.tpm.constant.AssetListConstants.*;</span>
<span class="line">import static org.springblade.tpm.constant.AssetListConstants.ASSET_STATE_CODE_IDLE;</span>
<span class="line">import static org.springblade.tpm.constant.LineAssetAdaptCategory.ADAPT_ENABLE;</span>
<span class="line">import static org.springblade.tpm.constant.NumConstants.NUM_NINETY;</span>
<span class="line">import static org.springblade.tpm.constant.NumConstants.NUM_THIRTY;</span>
<span class="line">import static org.springblade.tpm.constant.StatusCodeConstants.STATUS_CODE_OK;</span>
<span class="line">import static org.springblade.tpm.constant.TpmConstants.FOUR_NUM_MAX;</span>
<span class="line"></span>
<span class="line">/**</span>
<span class="line"> * 资产台账 服务实现类</span>
<span class="line"> *</span>
<span class="line"> * @author BladeX</span>
<span class="line"> * @since 2023-11-30</span>
<span class="line"> */</span>
<span class="line">@Slf4j</span>
<span class="line">@Service</span>
<span class="line">@RequiredArgsConstructor</span>
<span class="line">public class AssetListServiceImpl extends BaseServiceImpl&lt;AssetListMapper, AssetListEntity&gt; implements IAssetListService {</span>
<span class="line"></span>
<span class="line">	private final ICategoryService categoryService;</span>
<span class="line">	private final ISubCategoryService subCategoryService;</span>
<span class="line">	private final IProcessCategoryService processCategoryService;</span>
<span class="line">	private final IProcessSubCategoryService processSubCategoryService;</span>
<span class="line">	private final IFunctionCodeService functionCodeService;</span>
<span class="line">	private final AssetExFieldMapper assetExFieldMapper;</span>
<span class="line">	private final AssetListMapper assetListMapper;</span>
<span class="line">	private final IAssetExFieldService assetExFieldService;</span>
<span class="line">	private final IAssetCycleParamService assetCycleParamService;</span>
<span class="line">	private final IAssetStateCodeLogService assetStateCodeLogService;</span>
<span class="line">	private final ILineAssetBomService lineAssetBomService;</span>
<span class="line">	private final ILineAssetAdaptCategoryService lineAssetAdaptCategoryService;</span>
<span class="line">	private final ICostCenterService costCenterService;</span>
<span class="line">	private final IUserClient userClient;</span>
<span class="line">	private final IAustinClient austinClient;</span>
<span class="line">	private final RestTemplate restTemplate = new RestTemplate();</span>
<span class="line">	private final IAssetMaterialService assetMaterialService;</span>
<span class="line">	private static final String FORMAT_CODE = &quot;0000&quot;;</span>
<span class="line"></span>
<span class="line">	@Value(&quot;\${sap.search-url}&quot;)</span>
<span class="line">	private String searchUrl;</span>
<span class="line"></span>
<span class="line">	@Value(&quot;\${tpm.environment}&quot;)</span>
<span class="line">	private String environment;</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public IPage&lt;AssetListVO&gt; selectAssetListPage(IPage&lt;AssetListVO&gt; page, AssetListVO assetList) {</span>
<span class="line">		return page.setRecords(baseMapper.selectAssetListPage(page, assetList,assetList.getAssetCodes()));</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;AssetListEntity&gt; exportAssetList(List&lt;Long&gt; ids) {</span>
<span class="line">		List&lt;AssetListEntity&gt; assetListList = baseMapper.selectBatchIds(ids);</span>
<span class="line">		//assetListList.forEach(assetList -&gt; {</span>
<span class="line">		//	assetList.setTypeName(DictCache.getValue(DictEnum.YES_NO, AssetList.getType()));</span>
<span class="line">		//});</span>
<span class="line">		return assetListList;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;TreeVO&gt; tree(AssetListEntity assetList) {</span>
<span class="line">		//1.获取数据列表,用于构建资产台账树型列表</span>
<span class="line">		List&lt;CategoryEntity&gt; categoryEntityList = Optional.ofNullable(assetList.getCgCode())</span>
<span class="line">			.map(cgCode -&gt; categoryService.list(</span>
<span class="line">				Wrappers.lambdaQuery(CategoryEntity.class)</span>
<span class="line">					.eq(CategoryEntity::getCgCode, cgCode)))</span>
<span class="line">			.orElseGet(categoryService::list);</span>
<span class="line">		List&lt;SubCategoryEntity&gt; subCategoryEntityList = Optional.ofNullable(assetList.getScgCode())</span>
<span class="line">			.map(scgCode -&gt; subCategoryService.list(</span>
<span class="line">				Wrappers.lambdaQuery(SubCategoryEntity.class).eq(SubCategoryEntity::getScgCode, scgCode)))</span>
<span class="line">			.orElseGet(subCategoryService::list);</span>
<span class="line">		List&lt;ProcessCategoryEntity&gt; processCategoryEntityList = Optional.ofNullable(assetList.getPcgCode())</span>
<span class="line">			.map(pcgCode -&gt; processCategoryService.list(</span>
<span class="line">				Wrappers.lambdaQuery(ProcessCategoryEntity.class).eq(ProcessCategoryEntity::getPcgCode, pcgCode)))</span>
<span class="line">			.orElseGet(processCategoryService::list);</span>
<span class="line">		List&lt;ProcessSubCategoryEntity&gt; processSubCategoryEntityList = Optional.ofNullable(assetList.getPscgCode())</span>
<span class="line">			.map(pscgCode -&gt; processSubCategoryService.list(</span>
<span class="line">				Wrappers.lambdaQuery(ProcessSubCategoryEntity.class).eq(ProcessSubCategoryEntity::getPscgCode, pscgCode)))</span>
<span class="line">			.orElseGet(processSubCategoryService::list);</span>
<span class="line">		List&lt;FunctionCodeEntity&gt; functionCodeEntityList = Optional.ofNullable(assetList.getFunCode())</span>
<span class="line">			.map(funCode -&gt; functionCodeService.list(</span>
<span class="line">				Wrappers.lambdaQuery(FunctionCodeEntity.class).eq(FunctionCodeEntity::getFunCode, funCode)))</span>
<span class="line">			.orElseGet(functionCodeService::list);</span>
<span class="line"></span>
<span class="line">		//2.使用线程池并行处理数据构建树形结构</span>
<span class="line">		return categoryEntityList.parallelStream()</span>
<span class="line">			.filter(StreamUtil.distinctByKeys(CategoryEntity::getCgCode))</span>
<span class="line">			.map(categoryEntity -&gt; buildCategoryTree(categoryEntity, subCategoryEntityList, processCategoryEntityList, processSubCategoryEntityList, functionCodeEntityList))</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	/**</span>
<span class="line">	 * 构建资产大类别树形结构</span>
<span class="line">	 */</span>
<span class="line">	private TreeVO buildCategoryTree(CategoryEntity categoryEntity, List&lt;SubCategoryEntity&gt; subCategoryEntityList, List&lt;ProcessCategoryEntity&gt; processCategoryEntityList, List&lt;ProcessSubCategoryEntity&gt; processSubCategoryEntityList, List&lt;FunctionCodeEntity&gt; functionCodeEntityList) {</span>
<span class="line">		TreeVO categoryVO = new TreeVO();</span>
<span class="line">		categoryVO.setId(categoryEntity.getId());</span>
<span class="line">		categoryVO.setCode(categoryEntity.getCgCode());</span>
<span class="line">		categoryVO.setName(categoryEntity.getCgName());</span>
<span class="line">		categoryVO.setParentId(BladeConstant.TOP_PARENT_ID.toString());</span>
<span class="line"></span>
<span class="line">		if (subCategoryEntityList != null) {</span>
<span class="line">			List&lt;TreeVO&gt; subCategoryVOList = subCategoryEntityList.parallelStream()</span>
<span class="line">				.filter(StreamUtil.distinctByKeys(SubCategoryEntity::getCgCode, SubCategoryEntity::getScgCode))</span>
<span class="line">				.filter(subCategoryEntity -&gt; subCategoryEntity.getCgCode().equals(categoryEntity.getCgCode()))</span>
<span class="line">				.map(subCategoryEntity -&gt; buildSubCategoryTree(subCategoryEntity, categoryVO.getCode(), processCategoryEntityList, processSubCategoryEntityList, functionCodeEntityList))</span>
<span class="line">				.collect(Collectors.toList());</span>
<span class="line">			categoryVO.setChildren(subCategoryVOList);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		return categoryVO;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	/**</span>
<span class="line">	 * 构建资产小类别树型结构</span>
<span class="line">	 */</span>
<span class="line">	private TreeVO buildSubCategoryTree(SubCategoryEntity subCategoryEntity, String parentCode, List&lt;ProcessCategoryEntity&gt; processCategoryEntityList, List&lt;ProcessSubCategoryEntity&gt; processSubCategoryEntityList, List&lt;FunctionCodeEntity&gt; functionCodeEntityList) {</span>
<span class="line">		TreeVO subCategoryVO = new TreeVO();</span>
<span class="line">		subCategoryVO.setId(subCategoryEntity.getId());</span>
<span class="line">		subCategoryVO.setCode(subCategoryEntity.getScgCode());</span>
<span class="line">		subCategoryVO.setName(subCategoryEntity.getScgName());</span>
<span class="line">		subCategoryVO.setParentId(parentCode);</span>
<span class="line"></span>
<span class="line">		if (processCategoryEntityList != null) {</span>
<span class="line">			List&lt;TreeVO&gt; processCategoryVOList = processCategoryEntityList.parallelStream()</span>
<span class="line">				.filter(StreamUtil.distinctByKeys(ProcessCategoryEntity::getCgCode, ProcessCategoryEntity::getScgCode, ProcessCategoryEntity::getPcgCode))</span>
<span class="line">				.filter(processCategoryEntity -&gt; processCategoryEntity.getCgCode().equals(subCategoryEntity.getCgCode()) &amp;&amp; processCategoryEntity.getScgCode().equals(subCategoryEntity.getScgCode()))</span>
<span class="line">				.map(processCategoryEntity -&gt; buildProcessCategoryTree(processCategoryEntity, subCategoryVO.getCode(), processSubCategoryEntityList, functionCodeEntityList))</span>
<span class="line">				.collect(Collectors.toList());</span>
<span class="line">			subCategoryVO.setChildren(processCategoryVOList);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		return subCategoryVO;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	/**</span>
<span class="line">	 * 构建资产工艺类别树型结构</span>
<span class="line">	 */</span>
<span class="line">	private TreeVO buildProcessCategoryTree(ProcessCategoryEntity processCategoryEntity, String parentCode, List&lt;ProcessSubCategoryEntity&gt; processSubCategoryEntityList, List&lt;FunctionCodeEntity&gt; functionCodeEntityList) {</span>
<span class="line">		TreeVO processCategoryVO = new TreeVO();</span>
<span class="line">		processCategoryVO.setId(processCategoryEntity.getId());</span>
<span class="line">		processCategoryVO.setCode(processCategoryEntity.getPcgCode());</span>
<span class="line">		processCategoryVO.setName(processCategoryEntity.getPcgName());</span>
<span class="line">		processCategoryVO.setParentId(parentCode);</span>
<span class="line"></span>
<span class="line">		if (processSubCategoryEntityList != null) {</span>
<span class="line">			List&lt;TreeVO&gt; processSubCategoryVOList = processSubCategoryEntityList.parallelStream()</span>
<span class="line">				.filter(StreamUtil.distinctByKeys(ProcessSubCategoryEntity::getCgCode, ProcessSubCategoryEntity::getScgCode, ProcessSubCategoryEntity::getPcgCode, ProcessSubCategoryEntity::getPscgCode))</span>
<span class="line">				.filter(processSubCategoryEntity -&gt; processSubCategoryEntity.getCgCode().equals(processCategoryEntity.getCgCode())</span>
<span class="line">					&amp;&amp; processSubCategoryEntity.getScgCode().equals(processCategoryEntity.getScgCode())</span>
<span class="line">					&amp;&amp; processSubCategoryEntity.getPcgCode().equals(processCategoryEntity.getPcgCode()))</span>
<span class="line">				.map(processSubCategoryEntity -&gt; buildProcessSubCategoryTree(processSubCategoryEntity, processCategoryVO.getCode(), functionCodeEntityList))</span>
<span class="line">				.collect(Collectors.toList());</span>
<span class="line">			processCategoryVO.setChildren(processSubCategoryVOList);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		return processCategoryVO;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	/**</span>
<span class="line">	 * 构建资产工艺小类别树型结构</span>
<span class="line">	 */</span>
<span class="line">	private TreeVO buildProcessSubCategoryTree(ProcessSubCategoryEntity processSubCategoryEntity, String parentCode, List&lt;FunctionCodeEntity&gt; functionCodeEntityList) {</span>
<span class="line">		TreeVO processSubCategoryVO = new TreeVO();</span>
<span class="line">		processSubCategoryVO.setId(processSubCategoryEntity.getId());</span>
<span class="line">		processSubCategoryVO.setCode(processSubCategoryEntity.getPscgCode());</span>
<span class="line">		processSubCategoryVO.setName(processSubCategoryEntity.getPscgName());</span>
<span class="line">		processSubCategoryVO.setParentId(parentCode);</span>
<span class="line"></span>
<span class="line">		if (functionCodeEntityList != null) {</span>
<span class="line">			List&lt;TreeVO&gt; functionCodeVOList = functionCodeEntityList.parallelStream()</span>
<span class="line">				.filter(StreamUtil.distinctByKeys(FunctionCodeEntity::getCgCode, FunctionCodeEntity::getScgCode, FunctionCodeEntity::getPcgCode, FunctionCodeEntity::getPscgCode, FunctionCodeEntity::getFunCode))</span>
<span class="line">				.filter(functionCodeEntity -&gt; functionCodeEntity.getCgCode().equals(processSubCategoryEntity.getCgCode())</span>
<span class="line">					&amp;&amp; functionCodeEntity.getScgCode().equals(processSubCategoryEntity.getScgCode())</span>
<span class="line">					&amp;&amp; functionCodeEntity.getPcgCode().equals(processSubCategoryEntity.getPcgCode())</span>
<span class="line">					&amp;&amp; functionCodeEntity.getPscgCode().equals(processSubCategoryEntity.getPscgCode()))</span>
<span class="line">				.map(functionCodeEntity -&gt; {</span>
<span class="line">					TreeVO functionCodeVO = new TreeVO();</span>
<span class="line">					functionCodeVO.setId(functionCodeEntity.getId());</span>
<span class="line">					functionCodeVO.setCode(functionCodeEntity.getFunCode());</span>
<span class="line">					functionCodeVO.setName(functionCodeEntity.getFunName());</span>
<span class="line">					functionCodeVO.setParentId(processSubCategoryVO.getCode());</span>
<span class="line">					return functionCodeVO;</span>
<span class="line">				})</span>
<span class="line">				.collect(Collectors.toList());</span>
<span class="line">			processSubCategoryVO.setChildren(functionCodeVOList);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		return processSubCategoryVO;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public boolean updateStatus(List&lt;Long&gt; ids, String assetStateCode) {</span>
<span class="line">		return baseMapper.updateByIds(ids, assetStateCode);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public boolean add(AssetListEntity assetList , BladeUser bladeUser) {</span>
<span class="line">		//1.判断asset_list中是否具有相同的资产编号,用于防止重复添加</span>
<span class="line">		AssetListEntity assetListEntity = this.getOne(</span>
<span class="line">			Wrappers.lambdaQuery(AssetListEntity.class)</span>
<span class="line">			.eq(AssetListEntity::getAssetCode, assetList.getAssetCode()));</span>
<span class="line">		//2.判断资产编号是否已存在</span>
<span class="line">		if (ObjectUtil.isNotEmpty(assetListEntity)) {</span>
<span class="line">			throw new RuntimeException(&quot;该资产编号已存在，请重新输入&quot;);</span>
<span class="line">		}</span>
<span class="line">		//3.添加资产属性</span>
<span class="line">		return this.save(assetList);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;AssetListEntity&gt; selectAssetList(List&lt;String&gt; assetCodeList) {</span>
<span class="line">		return baseMapper.selectList(Wrappers.&lt;AssetListEntity&gt;lambdaQuery()</span>
<span class="line">			.in(AssetListEntity::getAssetCode, assetCodeList));</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;AssetListEntity&gt; selectAssets() {</span>
<span class="line">		List&lt;AssetListEntity&gt; assetList = new ArrayList&lt;&gt;();</span>
<span class="line"></span>
<span class="line">		assetListMapper.streamQueryData(assetListEntity -&gt; {</span>
<span class="line">			assetList.add(assetListEntity.getResultObject());</span>
<span class="line">		});</span>
<span class="line">		return assetList;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public boolean acceptance(AssetOaEntity assetOaEntity) {</span>
<span class="line">		//1、获取资产台账待验收资产</span>
<span class="line">		List&lt;AssetListEntity&gt; assetList = this.list(Wrappers.&lt;AssetListEntity&gt;lambdaQuery()</span>
<span class="line">			.eq(AssetListEntity::getStatus, 0));</span>
<span class="line">		if (Func.isEmpty(assetList)) {</span>
<span class="line">			log.error(&quot;获取资产台账待验收资产为空！！！&quot;);</span>
<span class="line">		}</span>
<span class="line">		//2、转为json字符串存入asset_oa表</span>
<span class="line">		String jsonStr = JSONUtil.toJsonStr(assetList);</span>
<span class="line">		assetOaEntity.setOaJson(jsonStr);</span>
<span class="line">		//3、发起验收 完善资产验收信息</span>
<span class="line">		return sendOaAcceptance(assetOaEntity);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	@Transactional(rollbackFor = Exception.class)</span>
<span class="line">	public boolean syncSap(AssetListEntity assetList) {</span>
<span class="line">		//1、获取SAP入库信息(检索PO或入库单号)(获取入库固资物料+数量+资产流水号)</span>
<span class="line">		List&lt;AssetListEntity&gt; sapInventory = getSapInventory(assetList);</span>
<span class="line">		//2、生成资产台账信息(系统编制新资产编码，标识待验收)</span>
<span class="line">		if (Func.isEmpty(sapInventory)) {</span>
<span class="line">			log.error(&quot;获取SAP入库信息为空！！！&quot;);</span>
<span class="line">		}</span>
<span class="line">		Objects.requireNonNull(sapInventory)</span>
<span class="line">			.forEach(assetListEntity -&gt; assetListEntity.setStatus(0));</span>
<span class="line">		//3、批量插入资产台账信息</span>
<span class="line">		this.saveBatch(sapInventory);</span>
<span class="line"></span>
<span class="line">        return false;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public AssetListDTO detailByAssetCode(String assetCode) {</span>
<span class="line">		//或者资产台账信息</span>
<span class="line">		AssetListEntity assetListEntity = baseMapper.selectOne(Wrappers.lambdaQuery(AssetListEntity.class)</span>
<span class="line">			.eq(AssetListEntity::getAssetCode, assetCode));</span>
<span class="line">		//获取扩展信息</span>
<span class="line">		List&lt;AssetExFieldEntity&gt; assetExFieldEntityList = assetExFieldService.list(Wrappers.lambdaQuery(AssetExFieldEntity.class)</span>
<span class="line">			.eq(AssetExFieldEntity::getAssetCode, assetCode));</span>
<span class="line">		//资产周期性参数</span>
<span class="line">		List&lt;AssetCycleParamEntity&gt; assetCycleParamEntityList = assetCycleParamService.list(Wrappers.lambdaQuery(AssetCycleParamEntity.class)</span>
<span class="line">			.eq(AssetCycleParamEntity::getAssetCode, assetCode));</span>
<span class="line"></span>
<span class="line">		AssetListDTO assetListDTO = new AssetListDTO();</span>
<span class="line">		BeanUtil.copy(assetListEntity, assetListDTO);</span>
<span class="line">		assetListDTO.setAssetExFieldEntityList(assetExFieldEntityList);</span>
<span class="line">		assetListDTO.setAssetCycleParamEntityList(assetCycleParamEntityList);</span>
<span class="line">		return assetListDTO;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">    @Override</span>
<span class="line">    public List&lt;AssetExFieldEntity&gt; getAssetListEx(AssetListExPo assetListExPo) {</span>
<span class="line">		//1.首先根据资产类别条件查询资产台账信息</span>
<span class="line">		List&lt;AssetListEntity&gt; assetListEntityList = baseMapper.selectList(Wrappers.lambdaQuery(AssetListEntity.class)</span>
<span class="line">			.eq(ObjectUtil.isNotEmpty(assetListExPo.getCgCode()), AssetListEntity::getCgCode, assetListExPo.getCgCode())</span>
<span class="line">			.eq(ObjectUtil.isNotEmpty(assetListExPo.getScgCode()), AssetListEntity::getScgCode, assetListExPo.getScgCode())</span>
<span class="line">			.eq(ObjectUtil.isNotEmpty(assetListExPo.getPcgCode()), AssetListEntity::getPcgCode, assetListExPo.getPcgCode())</span>
<span class="line">			.eq(ObjectUtil.isNotEmpty(assetListExPo.getPscgCode()), AssetListEntity::getPscgCode, assetListExPo.getPscgCode())</span>
<span class="line">			.eq(ObjectUtil.isNotEmpty(assetListExPo.getFunCode()), AssetListEntity::getFunCode, assetListExPo.getFunCode()));</span>
<span class="line">		//1.1判空</span>
<span class="line">		if (Func.isEmpty(assetListEntityList)) {</span>
<span class="line">			return Collections.emptyList();</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//2.提取资产编码集合</span>
<span class="line">		List&lt;String&gt; assetCodes = assetListEntityList.stream().map(AssetListEntity::getAssetCode).distinct().collect(Collectors.toList());</span>
<span class="line"></span>
<span class="line">		//3.根据资产编码集合查询资产扩展属性列表</span>
<span class="line">		return assetExFieldService.list(Wrappers.lambdaQuery(AssetExFieldEntity.class)</span>
<span class="line">				.eq(ObjectUtil.isNotEmpty(assetListExPo.getTmplCode()), AssetExFieldEntity::getTmplCode, assetListExPo.getTmplCode())</span>
<span class="line">				.eq(ObjectUtil.isNotEmpty(assetListExPo.getFieldName()), AssetExFieldEntity::getFieldName, assetListExPo.getFieldName())</span>
<span class="line">			.in(AssetExFieldEntity::getAssetCode, assetCodes));</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;AssetListEntity&gt; queryAssetList(AssetListVO assetListVO) {</span>
<span class="line">		return baseMapper.queryAssetList(assetListVO);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	@Transactional(rollbackFor = Exception.class)</span>
<span class="line">	public boolean updateAssetStateCodeByThreeInfo(BladeUser bladeUser) {</span>
<span class="line">		//1.查询所有状态为“待用”的资产，且满足指定分类规则</span>
<span class="line">		//查询出产线设备资适配类别</span>
<span class="line">		List&lt;String&gt; assetCategoryList = lineAssetAdaptCategoryService.list(</span>
<span class="line">				Wrappers.lambdaQuery(LineAssetAdaptCategoryEntity.class)</span>
<span class="line">					.eq(LineAssetAdaptCategoryEntity::getAdapt,ADAPT_ENABLE))</span>
<span class="line">			.stream()</span>
<span class="line">			.map(LineAssetAdaptCategoryEntity::getAssetCategory)</span>
<span class="line">			.distinct()</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line">		if (ObjectUtil.isEmpty(assetCategoryList)) {</span>
<span class="line">			return true;</span>
<span class="line">		}</span>
<span class="line">		// 构建查询条件</span>
<span class="line">		LambdaQueryWrapper&lt;AssetListEntity&gt; queryWrapper = Wrappers.lambdaQuery(AssetListEntity.class)</span>
<span class="line">			.eq(AssetListEntity::getAssetStateCode, ASSET_STATE_CODE_TO_BE_USED).and(wrapper -&gt; {</span>
<span class="line">			assetCategoryList.forEach(category -&gt; wrapper.or().likeRight(AssetListEntity::getAssetCode, category));</span>
<span class="line">		});</span>
<span class="line">		// 执行查询</span>
<span class="line">		List&lt;AssetListEntity&gt; assetListEntityList = this.list(queryWrapper);</span>
<span class="line"></span>
<span class="line">		//2.如果没有符合条件的资产，直接返回 true 表示处理完成</span>
<span class="line">		if (Func.isEmpty(assetListEntityList)) {</span>
<span class="line">			return true;</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//3.构建 Map: assetCode -&gt; 日志列表</span>
<span class="line">		Map&lt;String, List&lt;AssetStateCodeLogEntity&gt;&gt; logMap = assetStateCodeLogService.list(</span>
<span class="line">			Wrappers.lambdaQuery(AssetStateCodeLogEntity.class)</span>
<span class="line">				.apply(&quot;asset_code regexp &#39;^A01|^A02|^A03|^A05|^B11|^D|^E&#39;&quot;))</span>
<span class="line">			.stream()</span>
<span class="line">			.collect(Collectors.groupingBy(AssetStateCodeLogEntity::getAssetCode));</span>
<span class="line"></span>
<span class="line">		//4.准备两个列表：用于批量更新资产状态 &amp; 新增状态变更日志</span>
<span class="line">		List&lt;AssetListEntity&gt; updateAssetList = Collections.synchronizedList(new ArrayList&lt;&gt;());</span>
<span class="line">		List&lt;AssetStateCodeLogEntity&gt; saveLogList = Collections.synchronizedList(new ArrayList&lt;&gt;());</span>
<span class="line"></span>
<span class="line">		//5.遍历每个资产并处理</span>
<span class="line">		assetListEntityList.parallelStream()</span>
<span class="line">			.forEach(assetListEntity -&gt; processAsset(assetListEntity, logMap, bladeUser, updateAssetList, saveLogList));</span>
<span class="line"></span>
<span class="line">		// 6. 批量更新资产表和日志表（需你的 service 支持批量操作）</span>
<span class="line">		return this.updateBatchById(updateAssetList)&amp;&amp; assetStateCodeLogService.saveBatch(saveLogList);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public boolean updateAssetStateCodeByThreeOne(BladeUser bladeUser) {</span>
<span class="line">		//1.首先获取所有资产状态为4维修5保养6校准的资产</span>
<span class="line">		//查询出产线设备资适配类别</span>
<span class="line">		List&lt;String&gt; assetCategoryList = lineAssetAdaptCategoryService.list(</span>
<span class="line">				Wrappers.lambdaQuery(LineAssetAdaptCategoryEntity.class)</span>
<span class="line">					.eq(LineAssetAdaptCategoryEntity::getAdapt,ADAPT_ENABLE))</span>
<span class="line">			.stream()</span>
<span class="line">			.map(LineAssetAdaptCategoryEntity::getAssetCategory)</span>
<span class="line">			.distinct()</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line">		if (ObjectUtil.isEmpty(assetCategoryList)) {</span>
<span class="line">			return true;</span>
<span class="line">		}</span>
<span class="line">		// 构建查询条件</span>
<span class="line">		LambdaQueryWrapper&lt;AssetListEntity&gt; queryWrapper = Wrappers.lambdaQuery(AssetListEntity.class)</span>
<span class="line">			.in(AssetListEntity::getAssetStateCode, Arrays.asList(</span>
<span class="line">				ASSET_STATE_CODE_REPAIR,</span>
<span class="line">				ASSET_STATE_CODE_MAINTENANCE,</span>
<span class="line">				ASSET_STATE_CODE_CALIBRATION)).and(wrapper -&gt; {</span>
<span class="line">				assetCategoryList.forEach(category -&gt; wrapper.or().likeRight(AssetListEntity::getAssetCode, category));</span>
<span class="line">			});</span>
<span class="line">		// 执行查询</span>
<span class="line">		List&lt;AssetListEntity&gt; assetListEntityList = this.list(queryWrapper);</span>
<span class="line"></span>
<span class="line">		// 2. 获取所有资产编码</span>
<span class="line">		List&lt;String&gt; assetCodes = assetListEntityList.stream()</span>
<span class="line">			.map(AssetListEntity::getAssetCode)</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line"></span>
<span class="line">		if (Func.isEmpty(assetListEntityList)) {</span>
<span class="line">			return true;</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		// 3. 构建 Map: assetCode -&gt; 日志列表</span>
<span class="line">		Map&lt;String, List&lt;AssetStateCodeLogEntity&gt;&gt; logMap = assetStateCodeLogService.list(Wrappers.lambdaQuery(AssetStateCodeLogEntity.class)</span>
<span class="line">				.in(AssetStateCodeLogEntity::getAssetCode, assetCodes)).stream()</span>
<span class="line">			.collect(Collectors.groupingBy(AssetStateCodeLogEntity::getAssetCode));</span>
<span class="line"></span>
<span class="line">		// 4. 准备两个 list 缓存用于后续批量删除</span>
<span class="line">		List&lt;String&gt; deleteAssetCoderList = new ArrayList&lt;&gt;();</span>
<span class="line"></span>
<span class="line">		// 5. 遍历资产列表</span>
<span class="line">		assetListEntityList.forEach(assetListEntity -&gt; {</span>
<span class="line">			String assetCode = assetListEntity.getAssetCode();</span>
<span class="line">			List&lt;AssetStateCodeLogEntity&gt; list = logMap.getOrDefault(assetCode, Collections.emptyList());</span>
<span class="line">			if (CollUtil.isNotEmpty(list)) {</span>
<span class="line">				// 排序一次</span>
<span class="line">				list.sort(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));</span>
<span class="line">				// 找到最新的记录</span>
<span class="line">				Optional&lt;AssetStateCodeLogEntity&gt; latestLogOptional = list.stream()</span>
<span class="line">					.max(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));</span>
<span class="line">				// 如果找到了符合条件的记录</span>
<span class="line">				if (latestLogOptional.isPresent()) {</span>
<span class="line">					Date createTimeOne = latestLogOptional.get().getCreateTime();</span>
<span class="line">					LocalDate createDate = createTimeOne.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();</span>
<span class="line">					LocalDate now = LocalDate.now();</span>
<span class="line">					long daysDifference = ChronoUnit.DAYS.between(createDate, now);</span>
<span class="line">					if (daysDifference &gt; NUM_THIRTY) {</span>
<span class="line">						deleteAssetCoderList.add(assetListEntity.getAssetCode());</span>
<span class="line">					}</span>
<span class="line">				}</span>
<span class="line">			}</span>
<span class="line">		});</span>
<span class="line"></span>
<span class="line">		if (ObjectUtil.isEmpty(deleteAssetCoderList)) {</span>
<span class="line">			return true;</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		// 6.找出LineAssetBom中删除的资产编码</span>
<span class="line">		List&lt;LineAssetBomEntity&gt; lineAssetBomEntityList = lineAssetBomService.list(Wrappers.lambdaQuery(LineAssetBomEntity.class)</span>
<span class="line">			.in(LineAssetBomEntity::getAssetCode, deleteAssetCoderList));</span>
<span class="line"></span>
<span class="line">		// 提取这些记录的ID列表</span>
<span class="line">		List&lt;Long&gt; idsToDelete = lineAssetBomEntityList.stream()</span>
<span class="line">			.map(LineAssetBomEntity::getId)</span>
<span class="line">			// 假设getId()方法返回的是记录的主键</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line"></span>
<span class="line">		// 使用ID列表批量删除记录</span>
<span class="line">		return lineAssetBomService.removeByIds(idsToDelete);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	@Transactional(rollbackFor = Exception.class)</span>
<span class="line">	public boolean updateByAssetList(AssetListEntity assetList, BladeUser user) {</span>
<span class="line">		//1.注入当前用户信息</span>
<span class="line">		Optional&lt;BladeUser&gt; bladeUserOptional = Optional.ofNullable(user);</span>
<span class="line">		bladeUserOptional.ifPresent(bladeUser -&gt; {</span>
<span class="line">			assetList.setModifyMan(bladeUser.getUserName());</span>
<span class="line">			EntityUtil.setCreateAndUpdateInfo(assetList, bladeUser, 1L);</span>
<span class="line">		});</span>
<span class="line">		//更新</span>
<span class="line">		boolean update = this.updateById(assetList);</span>
<span class="line">		List&lt;AssetExFieldEntity&gt; assetExFieldEntityList = assetList.getAssetExFieldEntityList();</span>
<span class="line">		if (CollUtil.isEmpty(assetExFieldEntityList)) {</span>
<span class="line">			return update;</span>
<span class="line">		}</span>
<span class="line">		//2.过滤出存在id的为需更新的资产拓展属性并注入当前用户信息</span>
<span class="line">		List&lt;AssetExFieldEntity&gt; toUpdateList = assetExFieldEntityList.stream()</span>
<span class="line">			.filter(assetExField -&gt; ObjectUtil.isNotEmpty(assetExField.getId()))</span>
<span class="line">			.peek(assetFile -&gt; bladeUserOptional.ifPresent(bladeUser -&gt; {</span>
<span class="line">				assetFile.setModifyMan(bladeUser.getUserName());</span>
<span class="line">				EntityUtil.setCreateAndUpdateInfo(assetFile, bladeUser, 1L);</span>
<span class="line">			}))</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line">		//3.过滤出不存在id的为需新增的资产拓展属性并注入当前用户信息</span>
<span class="line">		List&lt;AssetExFieldEntity&gt; toInsertList = assetExFieldEntityList.stream()</span>
<span class="line">			.filter(assetExField -&gt; ObjectUtil.isEmpty(assetExField.getId()))</span>
<span class="line">			.peek(assetFile -&gt; bladeUserOptional.ifPresent(bladeUser -&gt; {</span>
<span class="line">				assetFile.setCreateMan(bladeUser.getUserName());</span>
<span class="line">				assetFile.setModifyMan(bladeUser.getUserName());</span>
<span class="line">				EntityUtil.setCreateAndUpdateInfo(assetFile, bladeUser, 0L);</span>
<span class="line">			}))</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line"></span>
<span class="line">		//4.执行批量更新操作</span>
<span class="line">		assetExFieldService.updateBatchById(toUpdateList);</span>
<span class="line">		//5.执行批量新增操作</span>
<span class="line">		assetExFieldService.saveBatch(toInsertList);</span>
<span class="line">		return update;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;AssetListVO&gt; getAssetList(AssetListVO assetList) {</span>
<span class="line">		return baseMapper.getAssetList(assetList, assetList.getAssetCodes());</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;SapAssetPO&gt; getSapInfo(List&lt;Map&lt;String,String&gt;&gt; list) {</span>
<span class="line">		SapPO sapPo = new SapPO();</span>
<span class="line">		sapPo.setAshxName(&quot;SAP/SapRFC.ashx&quot;);</span>
<span class="line">		sapPo.setActionName(&quot;ashxSapRfc&quot;);</span>
<span class="line">		ClientParameterobject clientParameterobject = new ClientParameterobject();</span>
<span class="line">		clientParameterobject.setRfcName(&quot;ZFI_RFC_AS03&quot;);</span>
<span class="line">		IN_ITAB&lt;Map&lt;String,String&gt;&gt; in_itab = new IN_ITAB();</span>
<span class="line">		in_itab.setIN_ITAB(list);</span>
<span class="line">		clientParameterobject.setTableParams(in_itab);</span>
<span class="line">		sapPo.setClientParameterobject(clientParameterobject);</span>
<span class="line"></span>
<span class="line">		String jsonData = JSONUtil.toJsonStr(sapPo);</span>
<span class="line">		HttpURLConnection connection = null;</span>
<span class="line">		try {</span>
<span class="line">			// Create URL object</span>
<span class="line">			URL urlObject = new URL(searchUrl);</span>
<span class="line">			connection = (HttpURLConnection) urlObject.openConnection();</span>
<span class="line">			connection.setRequestMethod(&quot;POST&quot;);</span>
<span class="line">			connection.setRequestProperty(&quot;Authorization&quot;, &quot;Basic TXlBc2h4Q2xpZW50Okh6LTk2MzMrWz8/P10=&quot;);</span>
<span class="line">			connection.setRequestProperty(&quot;Data-Type&quot;, &quot;WebApi&quot;);</span>
<span class="line">			connection.setRequestProperty(&quot;Content-Type&quot;, &quot;application/json;charset=UTF-8&quot;);</span>
<span class="line">			connection.setDoOutput(true);</span>
<span class="line">			connection.setDoInput(true);</span>
<span class="line"></span>
<span class="line">			byte[] sendData = jsonData.getBytes(StandardCharsets.UTF_8);</span>
<span class="line">			try (OutputStream outputStream = connection.getOutputStream()) {</span>
<span class="line">				outputStream.write(sendData);</span>
<span class="line">			}</span>
<span class="line"></span>
<span class="line">			int responseCode = connection.getResponseCode();</span>
<span class="line">			if (responseCode != HttpURLConnection.HTTP_OK) {</span>
<span class="line">				throw new RuntimeException(&quot;Failed : HTTP error code : &quot; + responseCode);</span>
<span class="line">			}</span>
<span class="line"></span>
<span class="line">			try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {</span>
<span class="line">				StringBuilder response = new StringBuilder();</span>
<span class="line">				String line;</span>
<span class="line">				while ((line = reader.readLine()) != null) {</span>
<span class="line">					response.append(line);</span>
<span class="line">				}</span>
<span class="line">				System.out.println(&quot;Response: &quot; + response.toString());</span>
<span class="line"></span>
<span class="line">				// 解析响应数据</span>
<span class="line">				JSONObject jsonObject = JSON.parseObject(response.toString());</span>
<span class="line"></span>
<span class="line">				// 初始化返回列表</span>
<span class="line">				List&lt;SapAssetPO&gt; sapAssetPoList = new ArrayList&lt;&gt;();</span>
<span class="line"></span>
<span class="line">				// 获取 Data 下的 ResponseTableParams 对象</span>
<span class="line">				JSONObject responseTableParams = jsonObject.getJSONObject(&quot;Data&quot;)</span>
<span class="line">					.getJSONObject(&quot;ResponseTableParams&quot;);</span>
<span class="line">				// 获取 OUT_RESULT 对象</span>
<span class="line">				// 获取 OUT_RESULT 数组</span>
<span class="line">				JSONArray outResultArray = responseTableParams.getJSONArray(&quot;OUT_ITAB&quot;);</span>
<span class="line"></span>
<span class="line">				// 遍历 OUT_RESULT 数组并获取 TYPE 的值</span>
<span class="line">				for (int i = 0; i &lt; outResultArray.size(); i++) {</span>
<span class="line">					SapAssetPO sapAssetPO = new SapAssetPO();</span>
<span class="line">					JSONObject item = outResultArray.getJSONObject(i);</span>
<span class="line">					String bukrs = item.getString(&quot;BUKRS&quot;);</span>
<span class="line">					String anln1 = item.getString(&quot;ANLN1&quot;);</span>
<span class="line">					String invnr = item.getString(&quot;INVNR&quot;);</span>
<span class="line">					String deakt = item.getString(&quot;DEAKT&quot;);</span>
<span class="line">					String txt50 = item.getString(&quot;TXT50&quot;);</span>
<span class="line">					String s = &quot;0000-00-00&quot;;</span>
<span class="line">					if (s.equals(deakt)) {</span>
<span class="line">						sapAssetPO.setBUKRS(bukrs);</span>
<span class="line">						sapAssetPO.setANLN1(anln1);</span>
<span class="line">						sapAssetPO.setINVNR(invnr);</span>
<span class="line">						sapAssetPO.setDEAKT(deakt);</span>
<span class="line">						sapAssetPO.setTXT50(txt50);</span>
<span class="line">						sapAssetPoList.add(sapAssetPO);</span>
<span class="line">					}</span>
<span class="line">				}</span>
<span class="line"></span>
<span class="line">				// 这里可以根据需要进一步处理jsonObject 返回JSON字符串</span>
<span class="line">				return sapAssetPoList;</span>
<span class="line">			}</span>
<span class="line">		} catch (Exception e) {</span>
<span class="line">			e.printStackTrace();</span>
<span class="line">			return null;</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public List&lt;AssetListEntity&gt; listByCenterCode(List&lt;String&gt; assetFinanceStateCodeList) {</span>
<span class="line">		return baseMapper.listByCenterCode(assetFinanceStateCodeList);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">    @Override</span>
<span class="line">    public boolean batchSaveAccept(BladeUser bladeUser) {</span>
<span class="line">		//1.创建响应</span>
<span class="line">		HttpHeaders requestHeaders = new HttpHeaders();</span>
<span class="line">		requestHeaders.setContentType(MediaType.APPLICATION_JSON);</span>
<span class="line">		requestHeaders.set(&quot;Authorization&quot;, &quot;Basic TXlBc2h4Q2xpZW50Okh6LTk2MzMrWz8/P10=&quot;);</span>
<span class="line">		requestHeaders.set(&quot;Data-Type&quot;, &quot;WebApi&quot;);</span>
<span class="line"></span>
<span class="line">		//2.构建参数</span>
<span class="line">		HttpEntity&lt;Map&lt;String, Object&gt;&gt; requestRequestEntity = getMapHttpEntity(requestHeaders);</span>
<span class="line"></span>
<span class="line">		//3.发送Post请求</span>
<span class="line">		ResponseEntity&lt;String&gt; requestResponse = restTemplate.postForEntity(searchUrl, requestRequestEntity, String.class);</span>
<span class="line"></span>
<span class="line">		//4.解析</span>
<span class="line">		//4.1.获取原始响应体</span>
<span class="line">		String body = requestResponse.getBody();</span>
<span class="line">		if (body == null || body.trim().isEmpty()) {</span>
<span class="line">			throw new RuntimeException(&quot;SAP RFC 返回空响应&quot;);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//4.2.解析 JSON</span>
<span class="line">		JSONObject root;</span>
<span class="line">		try {</span>
<span class="line">			root = JSON.parseObject(body);</span>
<span class="line">		} catch (Exception e) {</span>
<span class="line">			throw new RuntimeException(&quot;JSON 解析失败，响应内容: &quot; + body, e);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//4.3.检查状态和消息</span>
<span class="line">		String msg = root.getString(&quot;MSG&quot;);</span>
<span class="line"></span>
<span class="line">		//如果 Status 是 &quot;EX&quot; 或 MSG 不是 &quot;OK&quot;，视为失败</span>
<span class="line">		if (!STATUS_CODE_OK.equals(msg)) {</span>
<span class="line">			throw new RuntimeException(&quot;SAP RFC 调用失败: &quot; + msg);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//4.4.获取 Data</span>
<span class="line">		JSONObject data = root.getJSONObject(&quot;Data&quot;);</span>
<span class="line">		if (data == null) {</span>
<span class="line">			throw new RuntimeException(&quot;SAP RFC 返回缺少 Data 字段&quot;);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//4.5.获取 ResponseTableParams</span>
<span class="line">		JSONObject responseTableParams = data.getJSONObject(&quot;ResponseTableParams&quot;);</span>
<span class="line">		if (responseTableParams == null) {</span>
<span class="line">			throw new RuntimeException(&quot;SAP RFC 返回缺少 ResponseTableParams&quot;);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//4.6.获取 IT_DATA 数组</span>
<span class="line">		JSONArray itDataArray = responseTableParams.getJSONArray(&quot;IT_DATA&quot;);</span>
<span class="line">		if (itDataArray == null || itDataArray.isEmpty()) {</span>
<span class="line">			throw new RuntimeException(&quot;未查询到入库单数据（IT_DATA 为空）&quot;);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//4.7.转换为 Java 对象列表</span>
<span class="line">		List&lt;AcceptAssetListPO&gt; acceptAssetList = itDataArray.toJavaList(AcceptAssetListPO.class);</span>
<span class="line"></span>
<span class="line">		//5.查询所有资产物料编码</span>
<span class="line">		List&lt;String&gt; materialNumberList = assetMaterialService.list()</span>
<span class="line">			.stream()</span>
<span class="line">			.map(AssetMaterialEntity::getAssetMtlCode)</span>
<span class="line">			.distinct()</span>
<span class="line">			.collect(Collectors.toList());</span>
<span class="line"></span>
<span class="line">		//1.首先创建每日初始流水号</span>
<span class="line">		int initialCount = 1;</span>
<span class="line">		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_CODE);</span>
<span class="line">		//1.2.格式化为四位流水号 code: 0001</span>
<span class="line">		String initialSerialNumber = decimalFormat.format(initialCount);</span>
<span class="line"></span>
<span class="line">		acceptAssetList.stream()</span>
<span class="line">			.filter(acceptAssetListPo -&gt; materialNumberList.contains(acceptAssetListPo.getMaterialNumber()) &amp;&amp;</span>
<span class="line">				Character.getNumericValue(acceptAssetListPo.getQuantity().charAt(0))&gt;=1)</span>
<span class="line">			.forEach(acceptAssetListPo -&gt; {</span>
<span class="line">				String initialAssetCode = acceptAssetListPo.getMaterialNumber() + initialSerialNumber;</span>
<span class="line">				for (int i = 0; i &lt; Character.getNumericValue(acceptAssetListPo.getQuantity().charAt(0)); i++) {</span>
<span class="line">					String assetCode = generateFallbackAssetCode(acceptAssetListPo.getMaterialNumber(), decimalFormat, initialAssetCode);</span>
<span class="line">					AssetListEntity assetListEntity = new AssetListEntity();</span>
<span class="line">					assetListEntity.setAssetCode(assetCode);</span>
<span class="line">					assetListEntity.setAssetStateCode(ASSET_STATE_CODE_TO_BE_USED);</span>
<span class="line">					assetListEntity.setAssetFinanceStateCode(ASSET_FINANCE_WAIT_ACCEPTANCE);</span>
<span class="line">					assetListEntity.setAssetType(ASSET_TYPE_FIXED);</span>
<span class="line">					assetListEntity.setPoNo(acceptAssetListPo.getPurchaseOrderNumber());</span>
<span class="line">					AssetMaterialEntity materialEntity = assetMaterialService.getOne(Wrappers.lambdaQuery(AssetMaterialEntity.class)</span>
<span class="line">						.eq(AssetMaterialEntity::getAssetMtlCode, acceptAssetListPo.getMaterialNumber()));</span>
<span class="line">					assetListEntity.setCgCode(materialEntity.getCgCode());</span>
<span class="line">					assetListEntity.setScgCode(materialEntity.getScgCode());</span>
<span class="line">					assetListEntity.setPcgCode(materialEntity.getPcgCode());</span>
<span class="line">					assetListEntity.setPscgCode(materialEntity.getPscgCode());</span>
<span class="line">					assetListEntity.setFunCode(materialEntity.getFunCode());</span>
<span class="line">					assetListEntity.setFinCode(materialEntity.getFinCode());</span>
<span class="line">					Optional.ofNullable(bladeUser)</span>
<span class="line">						.ifPresent(user -&gt; {</span>
<span class="line">							assetListEntity.setCreateMan(bladeUser.getUserName());</span>
<span class="line">							assetListEntity.setModifyMan(bladeUser.getUserName());</span>
<span class="line">							EntityUtil.setCreateAndUpdateInfo(assetListEntity, bladeUser, 0L);</span>
<span class="line">						});</span>
<span class="line">					this.save(assetListEntity);</span>
<span class="line">				}</span>
<span class="line">			});</span>
<span class="line"></span>
<span class="line">		return true;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">	@Override</span>
<span class="line">	public String generateAssetCode(AssetListEntity assetListEntity) {</span>
<span class="line">		//1.首先创建每日初始流水号</span>
<span class="line">		int initialCount = 1;</span>
<span class="line">		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_CODE);</span>
<span class="line">		//1.2.格式化为四位流水号 code: 0001</span>
<span class="line">		String initialSerialNumber = decimalFormat.format(initialCount);</span>
<span class="line"></span>
<span class="line">		//2.获取资产类别并拼接</span>
<span class="line">		String assetClass = getAssetClass(assetListEntity);</span>
<span class="line"></span>
<span class="line">		//3.拼接资产类别和流水号,初始化资产编码</span>
<span class="line">		String initialAssetCode = assetClass + initialSerialNumber;</span>
<span class="line"></span>
<span class="line">		return generateFallbackAssetCode(assetClass, decimalFormat, initialAssetCode);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	private static @NotNull HttpEntity&lt;Map&lt;String, Object&gt;&gt; getMapHttpEntity(HttpHeaders requestHeaders) {</span>
<span class="line">		Map&lt;String, Object&gt; requestBody = new HashMap&lt;&gt;(10);</span>
<span class="line">		requestBody.put(&quot;AshxName&quot;, &quot;SAP/SapRfc.ashx&quot;);</span>
<span class="line">		requestBody.put(&quot;ActionName&quot;, &quot;ashxSapRfc&quot;);</span>
<span class="line"></span>
<span class="line">		Map&lt;String, Object&gt; clientParamMap = new HashMap&lt;&gt;(10);</span>
<span class="line">		clientParamMap.put(&quot;RfcName&quot;, &quot;ZTPM_DATA_004&quot;);</span>
<span class="line"></span>
<span class="line">		Map&lt;String, Object&gt; inputParamsMap = new HashMap&lt;&gt;(10);</span>
<span class="line">		inputParamsMap.put(&quot;B_DATUM&quot;, &quot;20250121&quot;);</span>
<span class="line">		inputParamsMap.put(&quot;E_DATUM&quot;, &quot;20251121&quot;);</span>
<span class="line">		clientParamMap.put(&quot;InputParams&quot;, inputParamsMap);</span>
<span class="line">		requestBody.put(&quot;ClientParameterObject&quot;, clientParamMap);</span>
<span class="line"></span>
<span class="line">		return new HttpEntity&lt;&gt;(requestBody, requestHeaders);</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	private List&lt;AssetListEntity&gt; getSapInventory(AssetListEntity assetList) {</span>
<span class="line">		log.info(&quot;获取SAP入库信息&quot;);</span>
<span class="line">		return null;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	/**</span>
<span class="line">	 * 发起oa资产验收</span>
<span class="line">	 * @param assetOaEntity AssetOaEntity</span>
<span class="line">	 * @return boolean</span>
<span class="line">	 */</span>
<span class="line">	private boolean sendOaAcceptance(AssetOaEntity assetOaEntity) {</span>
<span class="line">		log.info(&quot;发起验收&quot;);</span>
<span class="line">		return false;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	/**</span>
<span class="line">	 * updateAssetStateCodeByThreeInfo</span>
<span class="line">	 * 5.遍历每个资产并处理</span>
<span class="line">	 */</span>
<span class="line">	private void processAsset(AssetListEntity assetListEntity,</span>
<span class="line">							  Map&lt;String, List&lt;AssetStateCodeLogEntity&gt;&gt; logMap,</span>
<span class="line">							  BladeUser bladeUser,</span>
<span class="line">							  List&lt;AssetListEntity&gt; updateAssetList,</span>
<span class="line">							  List&lt;AssetStateCodeLogEntity&gt; saveLogList) {</span>
<span class="line"></span>
<span class="line">		//1.获取资产编码</span>
<span class="line">		String assetCode = assetListEntity.getAssetCode();</span>
<span class="line">		List&lt;AssetStateCodeLogEntity&gt; list = logMap.getOrDefault(assetCode, Collections.emptyList());</span>
<span class="line"></span>
<span class="line">		//2.如果日志为空，直接跳过并记录错误</span>
<span class="line">		if (CollUtil.isEmpty(list)) {</span>
<span class="line">			log.error(&quot;资产 [{}] 无状态变更日志&quot;, assetCode);</span>
<span class="line">			return;</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		//2.排序一次,根据创建时间升序排列</span>
<span class="line">		list.sort(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));</span>
<span class="line"></span>
<span class="line">		//3.判断是否存在“在用”的状态</span>
<span class="line">		boolean hasInUse = list.stream().anyMatch(log -&gt; ASSET_STATE_CODE_IN_USE.equals(log.getAssetStateCode()));</span>
<span class="line"></span>
<span class="line">		Optional&lt;AssetStateCodeLogEntity&gt; targetLogOptional = Optional.empty();</span>
<span class="line"></span>
<span class="line">		if (hasInUse) {</span>
<span class="line">			// 存在“在用”的状态：找到最近的“在用”记录</span>
<span class="line">			Optional&lt;AssetStateCodeLogEntity&gt; latestInUse = list.stream()</span>
<span class="line">				.filter(log -&gt; ASSET_STATE_CODE_IN_USE.equals(log.getAssetStateCode()))</span>
<span class="line">				.max(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));</span>
<span class="line"></span>
<span class="line">			if (latestInUse.isPresent()) {</span>
<span class="line">				Date createTime = latestInUse.get().getCreateTime();</span>
<span class="line"></span>
<span class="line">				// 找到该时间之后最早的“待用”记录</span>
<span class="line">				targetLogOptional = list.stream()</span>
<span class="line">					.filter(log -&gt; ASSET_STATE_CODE_TO_BE_USED.equals(log.getAssetStateCode()))</span>
<span class="line">					.filter(log -&gt; createTime.before(log.getCreateTime()))</span>
<span class="line">					.min(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));</span>
<span class="line">			}</span>
<span class="line">		} else {</span>
<span class="line">			// 不存在“在用”的状态：找最早的一条“待用”记录</span>
<span class="line">			targetLogOptional = list.stream()</span>
<span class="line">				.filter(log -&gt; ASSET_STATE_CODE_TO_BE_USED.equals(log.getAssetStateCode()))</span>
<span class="line">				.min(Comparator.comparing(AssetStateCodeLogEntity::getCreateTime));</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		// 如果找到了符合条件的记录</span>
<span class="line">		if (targetLogOptional.isPresent()) {</span>
<span class="line">			Date createTimeOne = targetLogOptional.get().getCreateTime();</span>
<span class="line">			LocalDate createDate = createTimeOne.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();</span>
<span class="line">			LocalDate now = LocalDate.now();</span>
<span class="line">			long daysDifference = ChronoUnit.DAYS.between(createDate, now);</span>
<span class="line"></span>
<span class="line">			if (daysDifference &gt; NUM_NINETY) {</span>
<span class="line">				// 设置为闲置</span>
<span class="line">				assetListEntity.setAssetStateCode(ASSET_STATE_CODE_IDLE);</span>
<span class="line">				EntityUtil.setCreateAndUpdateInfo(assetListEntity, bladeUser, 1L);</span>
<span class="line">				assetListEntity.setModifyMan(bladeUser.getUserName());</span>
<span class="line">				updateAssetList.add(assetListEntity);</span>
<span class="line"></span>
<span class="line">				// 新增状态变更日志</span>
<span class="line">				AssetStateCodeLogEntity logEntity = new AssetStateCodeLogEntity();</span>
<span class="line">				logEntity.setAssetCode(assetCode);</span>
<span class="line">				logEntity.setAssetStateCode(ASSET_STATE_CODE_IDLE);</span>
<span class="line">				logEntity.setAssetFinanceStateCode(assetListEntity.getAssetFinanceStateCode());</span>
<span class="line">				logEntity.setCreateMan(bladeUser.getUserName());</span>
<span class="line">				logEntity.setModifyMan(bladeUser.getUserName());</span>
<span class="line">				EntityUtil.setCreateAndUpdateInfo(logEntity, bladeUser, 0L);</span>
<span class="line">				saveLogList.add(logEntity);</span>
<span class="line">			}</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	private String getAssetClass(AssetListEntity assetListEntity) {</span>
<span class="line">		return assetListEntity.getCgCode() +</span>
<span class="line">			assetListEntity.getScgCode() +</span>
<span class="line">			assetListEntity.getPcgCode() +</span>
<span class="line">			assetListEntity.getPscgCode() +</span>
<span class="line">			assetListEntity.getFunCode() +</span>
<span class="line">			assetListEntity.getFinCode();</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	private String generateFallbackAssetCode(String assetClass ,DecimalFormat decimalFormat ,String initialAssetCode) {</span>
<span class="line">		//4.查询数据库中该资产类别的最大流水号</span>
<span class="line">		Optional&lt;String&gt; maxAssetCodeOptional = this.list(</span>
<span class="line">				Wrappers.&lt;AssetListEntity&gt;lambdaQuery()</span>
<span class="line">					.likeRight(AssetListEntity::getAssetCode, assetClass))</span>
<span class="line">			.stream()</span>
<span class="line">			.map(AssetListEntity::getAssetCode)</span>
<span class="line">			.filter(Objects::nonNull)</span>
<span class="line">			.max(Comparator.naturalOrder());</span>
<span class="line"></span>
<span class="line">		//5.判断数据库中该资产类别的最大流水号是否为空</span>
<span class="line">		if (maxAssetCodeOptional.isPresent()) {</span>
<span class="line">			String maxAssetCode = maxAssetCodeOptional.get();</span>
<span class="line">			//5.1.判断流水号是否已满</span>
<span class="line">			if ((assetClass + FOUR_NUM_MAX).equals(maxAssetCode)) {</span>
<span class="line">				throw new RuntimeException(&quot;该资产类别 &quot; + assetClass + &quot; 流水号已满&quot;);</span>
<span class="line">			}</span>
<span class="line">			//5.2.提取流水号部分</span>
<span class="line">			String maxSerialNumberStr = maxAssetCode.substring(assetClass.length());</span>
<span class="line">			BigInteger maxSerialNumber = new BigInteger(maxSerialNumberStr);</span>
<span class="line">			BigInteger nextSerialNumber = maxSerialNumber.add(BigInteger.ONE);</span>
<span class="line">			String nextSerialNumberStr = decimalFormat.format(nextSerialNumber);</span>
<span class="line">			//6.返回下一个资产编码</span>
<span class="line">			return assetClass + nextSerialNumberStr;</span>
<span class="line">		}</span>
<span class="line">		//6.返回初始资产编码</span>
<span class="line">		return initialAssetCode;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	@Transactional(rollbackFor = Exception.class)</span>
<span class="line">	public boolean batchCreateAssetCodes(List&lt;AcceptAssetListPO&gt; acceptAssetList, List&lt;String&gt; materialNumberList, BladeUser bladeUser) {</span>
<span class="line">		// 1. 过滤出有效数据，并按物料编号分组（便于后续按物料批量处理流水号）</span>
<span class="line">		Map&lt;String, List&lt;AcceptAssetListPO&gt;&gt; groupedByMaterial = acceptAssetList.stream()</span>
<span class="line">			.filter(po -&gt; materialNumberList.contains(po.getMaterialNumber())</span>
<span class="line">				&amp;&amp; Character.isDigit(po.getQuantity().charAt(0))</span>
<span class="line">				&amp;&amp; Character.getNumericValue(po.getQuantity().charAt(0)) &gt;= 1)</span>
<span class="line">			.collect(Collectors.groupingBy(AcceptAssetListPO::getMaterialNumber));</span>
<span class="line"></span>
<span class="line">		// 2. 获取每个物料类别当前的最大流水号（只查一次/物料）</span>
<span class="line">		Map&lt;String, Integer&gt; currentMaxSerialMap = new HashMap&lt;&gt;(10);</span>
<span class="line">		for (String materialNumber : groupedByMaterial.keySet()) {</span>
<span class="line">			Optional&lt;String&gt; maxCodeOpt = this.list(</span>
<span class="line">					Wrappers.&lt;AssetListEntity&gt;lambdaQuery()</span>
<span class="line">						.likeRight(AssetListEntity::getAssetCode, materialNumber))</span>
<span class="line">				.stream()</span>
<span class="line">				.map(AssetListEntity::getAssetCode)</span>
<span class="line">				.filter(Objects::nonNull)</span>
<span class="line">				.max(Comparator.naturalOrder());</span>
<span class="line"></span>
<span class="line">			if (maxCodeOpt.isPresent()) {</span>
<span class="line">				String maxCode = maxCodeOpt.get();</span>
<span class="line">				if ((materialNumber + FOUR_NUM_MAX).equals(maxCode)) {</span>
<span class="line">					throw new RuntimeException(&quot;该资产类别 &quot; + materialNumber + &quot; 流水号已满&quot;);</span>
<span class="line">				}</span>
<span class="line">				String serialPart = maxCode.substring(materialNumber.length());</span>
<span class="line">				currentMaxSerialMap.put(materialNumber, Integer.parseInt(serialPart));</span>
<span class="line">			} else {</span>
<span class="line">				// 初始为0，下一条从1开始</span>
<span class="line">				currentMaxSerialMap.put(materialNumber, 0);</span>
<span class="line">			}</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		// 3. 构建所有 AssetListEntity // 假设 FORMAT_CODE = &quot;0000&quot;</span>
<span class="line">		List&lt;AssetListEntity&gt; entitiesToSave = new ArrayList&lt;&gt;();</span>
<span class="line">		DecimalFormat decimalFormat = new DecimalFormat(FORMAT_CODE);</span>
<span class="line"></span>
<span class="line">		for (Map.Entry&lt;String, List&lt;AcceptAssetListPO&gt;&gt; entry : groupedByMaterial.entrySet()) {</span>
<span class="line">			String materialNumber = entry.getKey();</span>
<span class="line">			List&lt;AcceptAssetListPO&gt; poList = entry.getValue();</span>
<span class="line"></span>
<span class="line">			int currentSerial = currentMaxSerialMap.get(materialNumber);</span>
<span class="line"></span>
<span class="line">			for (AcceptAssetListPO po : poList) {</span>
<span class="line">				int quantity = Character.getNumericValue(po.getQuantity().charAt(0));</span>
<span class="line">				for (int i = 0; i &lt; quantity; i++) {</span>
<span class="line">					currentSerial++; // 自增流水号</span>
<span class="line">					String assetCode = materialNumber + decimalFormat.format(currentSerial);</span>
<span class="line"></span>
<span class="line">					AssetListEntity entity = new AssetListEntity();</span>
<span class="line">					entity.setAssetCode(assetCode);</span>
<span class="line">					entity.setAssetStateCode(ASSET_STATE_CODE_TO_BE_USED);</span>
<span class="line">					entity.setAssetFinanceStateCode(ASSET_FINANCE_WAIT_ACCEPTANCE);</span>
<span class="line">					entity.setAssetType(ASSET_TYPE_FIXED);</span>
<span class="line">					entity.setPoNo(po.getPurchaseOrderNumber());</span>
<span class="line"></span>
<span class="line">					// 获取物料分类信息（建议提前批量查询，避免N+1）</span>
<span class="line">					AssetMaterialEntity materialEntity = assetMaterialService.getOne(</span>
<span class="line">						Wrappers.lambdaQuery(AssetMaterialEntity.class)</span>
<span class="line">							.eq(AssetMaterialEntity::getAssetMtlCode, materialNumber)</span>
<span class="line">					);</span>
<span class="line">					if (materialEntity != null) {</span>
<span class="line">						entity.setCgCode(materialEntity.getCgCode());</span>
<span class="line">						entity.setScgCode(materialEntity.getScgCode());</span>
<span class="line">						entity.setPcgCode(materialEntity.getPcgCode());</span>
<span class="line">						entity.setPscgCode(materialEntity.getPscgCode());</span>
<span class="line">						entity.setFunCode(materialEntity.getFunCode());</span>
<span class="line">						entity.setFinCode(materialEntity.getFinCode());</span>
<span class="line">					}</span>
<span class="line"></span>
<span class="line">					if (bladeUser != null) {</span>
<span class="line">						entity.setCreateMan(bladeUser.getUserName());</span>
<span class="line">						entity.setModifyMan(bladeUser.getUserName());</span>
<span class="line">						EntityUtil.setCreateAndUpdateInfo(entity, bladeUser, 0L);</span>
<span class="line">					}</span>
<span class="line"></span>
<span class="line">					entitiesToSave.add(entity);</span>
<span class="line">				}</span>
<span class="line">			}</span>
<span class="line"></span>
<span class="line">			// 更新该物料的最新流水号（用于下一个批次，如果需要持久化可存入缓存或表）</span>
<span class="line">			currentMaxSerialMap.put(materialNumber, currentSerial);</span>
<span class="line">		}</span>
<span class="line"></span>
<span class="line">		System.out.println(&quot;entitiesToSave: &quot; + entitiesToSave);</span>
<span class="line"></span>
<span class="line">		// 4. 批量保存</span>
<span class="line">		if (!entitiesToSave.isEmpty()) {</span>
<span class="line">			//return this.saveBatch(entitiesToSave);</span>
<span class="line">		}</span>
<span class="line">		return false;</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)])])}const d=n(a,[["render",l]]),r=JSON.parse('{"path":"/docs/Creation/Novel/1_First_Novel/1_First_Novel/1-First_Novel.html","title":"第一本小说","lang":"en-US","frontmatter":{"title":"第一本小说","date":"2025/11/06","password":["572106222bb8511a4b14e5029c9db7b9","641ddf8c0d7b7d4d901fea0873a9fa62"]},"headers":[{"level":2,"title":"楔子","slug":"楔子","link":"#楔子","children":[]}],"filePathRelative":"docs/Creation/Novel/1_First_Novel/1_First_Novel/1-First_Novel.md","git":{"createdTime":1764124184000,"updatedTime":1764124184000,"contributors":[{"name":"lixuan","email":"2789968443@qq.com","commits":1}]}}');export{d as comp,r as data};
