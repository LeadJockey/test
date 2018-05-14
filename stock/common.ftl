<#function hyphenateOnNull value>
    <#local isNull = false, isZero = false, isEmpty = false />
    <#if !value??>
        <#local isNull = true/>
    <#elseif value?is_string && (value == "" || value == "0")>
        <#local isEmpty = true/>
    <#elseif value?is_number && value == 0>
        <#local isZero = true/>
    </#if>
    <#if isNull || isZero || isEmpty>
        <#return "-"/>
    <#else>
        <#return value/>
    </#if>
</#function>

<#function limitLength value length>
    <#if value?length gt length>
        <#local sliced = value?replace(",", "")>
    </#if>
</#function>

<#function appendUnitIfNotNull value format unit="">
    <#local result = value?string/>
    <#if result != "-">
        <#if format != "">
            <#local result = value?string(format) + unit/>
        <#else>
            <#local result = value + unit/>
        </#if>
    </#if>
    <#return result/>
</#function>

<#function getDuplicateCheckedList sameKindCom, company>
    <#local sameComs = []/>
<#-- 중복 방지 필터링 -->
    <#list sameKindCom as each>
        <#if each.tickerSymbol != company.tickerSymbol>
            <#local sameComs = sameComs + [each]/>
        </#if>
    </#list>
    <#return sameComs/>
</#function>

<#function getHideClass eachIndex pagerNum>
    <#local class = "" />
    <#if eachIndex gt (pagerNum-1) >
        <#local class = "hide" />
    </#if>
    <#return class />
</#function>

<#function makeSearchLink q opts={}>
    <#local params = []/>
    <#if q?has_content && (results.meta.displayCode)?has_content>
        <#local params = params + ["q=${q?url('utf-8')}", "DA=${results.meta.displayCode}"]/>
    </#if>
    <#list opts?keys as key>
        <#local params = params + ["${key}=${opts[key]}"]/>
    </#list>
    <#local path = "?w=tot&${params?join('&')}" />
    <#return path/>
</#function>
