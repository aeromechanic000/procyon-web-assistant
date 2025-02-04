
function extract_search_result() {
    var info = {
        "html" : document.documentElement.innerHTML,
        "href" : window.location.href,
        "results" : [],
    };

    if (info["href"].includes("www.google.com/search")) {
        info["query"] = document.querySelector('.gLFyf').value;
        let result_elements = document.querySelectorAll('.tF2Cxc');  // Google search result class
        for (let result_element of result_elements) {
            let title_element = result_element.querySelector('h3');
            let title = "";
            if (title_element != null) title = title_element.innerText;
            let url_element = result_element.querySelector('a');
            let url = "";
            if (url_element != null) url = url_element.href;
            let brief = title;
            for (let tag of [".VwiC3b"]) {
                let brief_element = result_element.querySelector(tag);
                if (brief_element != null) {
                    brief += " " + brief_element.innerText;
                }
            }
            info["results"].push({title: title, url: url, brief: brief});
        }
    } else if (info["href"].includes("www.bing.com/search")) {
        let result_elements = document.querySelectorAll('.b_algo');  // Bing search result class
        for (let result_element of result_elements) {
            let title = result_element.querySelector('h2').innerText;
            let url = result_element.querySelector('a').href;
            let brief = title;
            for (let tag of [".b_lineclamp1", ".b_lineclamp2", ".b_lineclamp3", ".b_paractl"]) {
                let brief_element = result_element.querySelector(tag);
                if (brief_element != null) {
                    let brief_span = brief_element.querySelector("span");
                    if (brief_span != null) {
                        brief += " " + brief_span.innerHTML;
                    } else {
                        brief += " " + brief_element.innerHTML;
                    }
                }
            }
            info["results"].push({title: title, url: url, brief: brief});
        }
    }
    return info;
}

extract_search_result();
