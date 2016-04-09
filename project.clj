(defproject checkers "0.9.0-SNAPSHOT"
  :description "Property-based testing for JavaScript via ClojureScript's test.check"
  :url "https://github.com/glenjamin/checkers"

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.8.40"]
                 [org.clojure/test.check "0.9.0"]]

  :plugins [[lein-cljsbuild "1.1.3"]]

  :source-paths ["cljs"]

  :clean-targets ["out" "checkers.js" "checkers.js.map"]

  :cljsbuild {
    :builds [{:id "dev"
              :source-paths ["cljs"]
              :compiler {:output-to "checkers.js"
                         :output-dir "out/dev"
                         :preamble ["notice.txt"]
                         :optimizations :simple
                         :pretty-print true
                         :cache-analysis true
                         :source-map "checkers.js.map"
                         :language-in :ecmascript5
                         :language-out :ecmascript5}}
             {:id "release"
              :source-paths ["cljs"]
              :compiler {:output-to "checkers.js"
                         :output-dir "out/release"
                         :preamble ["notice.txt"]
                         :optimizations :advanced
                         :pretty-print true
                         :cache-analysis true
                         :language-in :ecmascript5
                         :language-out :ecmascript5}}]})
