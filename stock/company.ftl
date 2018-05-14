<#--outapi mapping-->
<#--해당 주: stock-cp-ticker-symbol-->
<#--관련 주: stock_prices-->
<#--OUT_HEF_3: stock_schedule-->
<#--코스닥 코스피 지수: stock_kospikosdaq-->

<#include "../../common/util.ftl">
<#import "../common.ftl" as fns/>
<#assign document = results.documents[0] />
<#assign contentKey = document.contentKey />
<#assign content = document.content />
<#assign displayCode = results.meta.displayCode />
<#assign stock_kospikosdaq = (results.api["stock_kospikosdaq"])!{}/>
<#assign stock_prices = (results.api["stock_prices"])![]/>
<#assign stock_info = (results.api["stock-cp-ticker-symbol"])!{}/>
<#assign stock_schedule = (results.api["stock_schedule"])!{}/>

<#if true || stock_info?has_content && stock_schedule?has_content && stock_prices?has_content && stock_kospikosdaq?has_content>
    <#assign market = {"Q": "코스닥","P": "코스피"}/>
    <#assign companyName = (stock_info.name)!content.synonyms[(content.synonyms?size - 1)]!"-"/>
    <#assign sectorName = fns.hyphenateOnNull(stock_info.sectorName)/>
    <#assign marketCapRank = fns.appendUnitIfNotNull(fns.hyphenateOnNull(stock_info.marketCapRank), "", "위")/>
    <#assign marketCapitalization100K = fns.hyphenateOnNull(stock_info.marketCapitalization100K)/>
    <#assign synonyms = (content.synonyms)![]/>
    <#assign cardTitle = (content.name)!""/>

    <div class="content_company" id="comRightColl">
        <div class="coll_tit">
            <h2 class="tit">${cardTitle} 기업정보</h2>
            <div class="mg_expander">
                <span class="f_nb">${formatDatetime(stock_schedule.date + stock_schedule.time + "00", "MM.dd. kk:mm")} 기준</span>
            </div>
        </div>
        <div class="coll_cont mg_cont">
            <table class="tbl_company">
                <caption>기업정보</caption>
                <colgroup>
                    <col style="width:22%">
                    <col style="width:30%">
                    <col style="width:25%">
                    <col>
                </colgroup>
                <tbody>
                <tr>
                    <th scope="row">업종</th>
                    <td>${sectorName!"-"}</td>
                    <th scope="row">PER</th>
                    <td>
                        <#if (stock_info.per)??>
                            ${stock_info.per?string("###.#")}배
                        <#else>
                            -
                        </#if>
                    </td>
                </tr>
                <tr>
                    <th scope="row">순위</th>
                    <td>
                        <#if marketCapRank != "-">
                            ${market[stock_info.market] + " " + marketCapRank}
                        <#else>
                            -
                        </#if>
                    </td>
                    <th scope="row">PBR</th>
                    <td>
                        <#if (stock_info.pbr)??>
                            ${stock_info.pbr?string("###.#")}배
                        <#else>
                            -
                        </#if>
                    </td>
                </tr>
                <tr>
                    <th scope="row">시가총액</th>
                    <td>
                        ${fns.appendUnitIfNotNull(marketCapitalization100K, "#,###" " 억")}
                    </td>
                    <th scope="row">배당수익률</th>
                    <td>
                        <#if (stock_info.dividendYield)??>
                            ${((stock_info.dividendYield)*100)?string("###.##")}%
                        <#else>
                            -
                        </#if>
                    </td>
                </tr>
                </tbody>
            </table>

        <#if stock_prices?size gt 0>
            <#assign status = {
                "1": {"class": "stock_up", "text": "상한가", "sign": "+"},
                "2": {"class": "stock_up", "text": "상승", "sign": "+"},
                "3": {"class": "stock_eq", "text": "보합", "sign": ""},
                "4": {"class": "stock_down", "text": "하한가", "sign": "-"},
                "5": {"class": "stock_down", "text": "하락", "sign": "-"}
            }/>
            <#assign pagerNum = stock_prices?size>
            <div class="wrap_subtit">
                <strong class="tit_sub">동일업종 종목</strong>
                <div class="paging_nav">
                        <span class="num_page">
                            <span class="screen_out">현재 페이지</span><em class="emph_num">1</em> /
                            <span class="screen_out">총 페이지</span><span class="total_page">1</span>
                        </span>
                    <span class="wrap_btn">
                        <a href="javascript:;" class="btn_page"
                           onclick="${p(log, {"e": 1})}">
                            <span class="ico_rwd ico_prev">이전</span>
                        </a>
                        <a href="javascript:;" class="btn_page"
                           onclick="${p(log, {"e": 1})}">
                            <span class="ico_rwd ico_next">다음</span>
                        </a>
                    </span>
                </div>
            </div>

            <div class="slide">
                <ul class="list_thumb list_info">
                    <#list stock_prices as each>
                        <li class="${fns.getHideClass(each?index, pagerNum)}">
                            <a href="${fns.makeSearchLink(each.name, { "rtmaxcoll": "1CI,YHJ"})}" class="link_item"
                               onclick="${p(log, {"p": 1, "r": (each?index)+1, "rc": stock_prices?size})}">
                                <strong class="tit_stock">${each.name}</strong>
                                <span class="info_stock ${status[each.change].class}">
                                    <!-- 상승일때 stock_up, 하락일때 stock_down 클래스 추가-->
                                    <span class="num_stock">${each.tradePrice?string(",###")}</span>
                                    <span class="num_gap">
                                       <#-- <span class="ico_rwdt ico_stock2">${status[each.change].text}</span>-->
                                        <#if each.change == "1" || each.change == "4" ><#-- 상한가 / 하한가 화살표 아이콘 추가 -->
                                          <span class="ico_rwdt ico_stock2">${status[each.change].text}</span>
                                        <#else>
                                          <span class="ico_rwdt ico_stock">${status[each.change].text}</span>
                                        </#if>
                                           ${each.changePrice?string(",###")}
                                    </span>
                                    <span class="num_rate">(${status[each.change].sign}${each.priceChangeRatio}%)</span>
                                 </span>
                            </a>
                        </li>
                    </#list>
                </ul>
            </div>
        </#if>
            <div class="txt_related">
                <dl class="dl_comm related_compo"><!-- dd가 흐를경우 dl_flow추가/ 관련검색은 related_compo추가 -->
                    <dt class="tit_base">관련</dt>
                    <dd class="cont">
                        <a href='${fns.makeSearchLink("코스피 시가총액 순위", {"rtmaxcoll":"0SP"})}' class="f_link"
                           onclick='${p(log, {"p":2, "r": 1})}'>코스피 시가총액 순위</a>
                        <span class="txt_bar"></span>
                        <a href='${fns.makeSearchLink("코스닥 시가총액 순위", {"rtmaxcoll":"0SP"})}' class="f_link"
                           onclick='${p(log, {"p":2, "r": 2})}'>코스닥 시가총액 순위</a>
                    </dd>
                </dl>
            </div>
        </div>
    </div>

<#--코스피/코스닥 지수-->
<#if stock_kospikosdaq?has_content>
    <div class="content_wstock">
        <div class="coll_tit coll_notit">
            <h2 class="tit">세계증시</h2>
        </div>
        <div class="coll_cont" id="worldStockRightColl">
        <#list stock_kospikosdaq?values as market>
            <#assign marketName = ((market.name)?substring(0,3))!""/>
            <#assign imageUrl = market.chart.day!''
            , linkUrl = imageUrl?replace('https://fn-chart.dunamu.com/images/kr/stock/d/', 'https://stock.kakao.com/m/stocks/KOREA-')?replace('.png', '')
            , beforeMarketOpenImgUrl = 'http://search1.daumcdn.net/search/statics/common/pi/img_stock_before.png'/>
            <div class="wrap_stock">
                <#--<#local logP = 0/><#if market?index == 0><#local logP =1/><#else><#local logP =2/></#if> &lt;#&ndash;smartlog P값을 정하기 위함&ndash;&gt;-->
                <a href="${fns.makeSearchLink(marketName, { "rtmaxcoll": 'HUS'})}" class="link_item"
                   onclick="${p(log, {"rc": stock_kospikosdaq?size, "p": 1, "r": market?index + 1})}">
					<span class="inner_item">
						<strong class="tit_stock">${market.name}</strong>
						<span class="info_stock ${status[market.change].class}"><!--// 상승일때 stock_up, 하락일때 stock_down 클래스 추가-->
							<span class="num_stock">${market.index}</span>
							<span class="num_gap">
                                <span class="ico_rwdt ico_stock">${status[market.change].text}</span>
                                ${market.changeIndex}(${status[market.change].sign}${market.indexChangeRatio}%)
                            </span>
						</span>
					</span>
                    <span class="wrap_thumb">
                        <#assign marketImgUrl = "" />
                        <#if stock_schedule.message == "개장전">
                            <#assign marketImgUrl = beforeMarketOpenImgUrl/>
                        <#else>
                            <#assign marketImgUrl = imageUrl />
                        </#if>
                        <img src="${marketImgUrl}"
                             onerror="SF.errorImage(this)" data-dstype="company" data-size="175x91"
                             class="thumb_stock" width="175"
                             height="91" alt="이미지 정보">
                    </span>
                </a>
            </div>
        </#list>
            <div class="txt_related">
                <dl class="dl_comm related_compo"><!-- dd가 흐를경우 dl_flow추가/ 관련검색은 related_compo추가 -->
                    <dt class="tit_base">관련</dt>
                    <dd class="cont">
                        <a href='${fns.makeSearchLink("세계증시",{"rtmaxcoll":"HSU"})}' class="f_link" onclick='${p(log, {"p": 3, "r": 1, "at": "link"})}'>세계증시</a>
                        <span class="txt_bar"></span>
                        <a href='${fns.makeSearchLink("환율",{"rtmaxcoll":"Z6T"})}' class="f_link" onclick='${p(log, {"p": 3, "r": 2, "at": "link"})}'>환율</a>
                        <span class="txt_bar"></span>
                        <a href='${fns.makeSearchLink("금시세",{"rtmaxcoll":"0SP"})}' class="f_link" onclick='${p(log, {"p": 3, "r": 3, "at": "link"})}'>금시세</a>
                        <span class="txt_bar"></span>
                        <a href='${fns.makeSearchLink("국제금속",{"rtmaxcoll":"0SP"})}' class="f_link" onclick='${p(log, {"p": 3, "r": 4, "at": "link"})}'>국제금속</a>
                    </dd>
                </dl>
                <span class="txt_offer">${formatDatetime(stock_schedule.date + stock_schedule.time + "00", "MM.dd. kk:mm")} 기준</span>
            </div>
        </div>
    </div>
</#if>
<#else>
    <@meta no_results=true />
</#if>
