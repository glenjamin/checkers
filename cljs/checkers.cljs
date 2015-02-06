(ns checkers
  (:require [cljs.test.check :as tc]
            [cljs.test.check.properties :as prop]
            [cljs.test.check.generators :as gen]
            [goog.object]))

;; Interop utils
(def ^:private format (aget (js/require "util") "format"))

(defn- obj-seq
  "Seq from enumerable keys of a JS Object"
  [obj]
  (for [k (goog.object/getKeys obj)]
    [k (aget obj k)]))

(defn- arrayify
  "Force a generator's output to be a JS array"
  [generator]
  (fn [& args] (gen/fmap into-array (apply generator args))))

(defn- obj-assoc [obj k v] (doto obj (aset (clj->js k) v)))
(defn- into-object [associative] (reduce-kv obj-assoc #js {} associative))
(defn- objectify
  "Force a generator's output to be a JS object"
  [generator]
  (fn [& args] (gen/fmap into-object (apply generator args))))

;; Check API

(defn- format-args [arglist]
  (.join (into-array (map #(format "%j" %) arglist)) ","))

(defn- generate-message
  [{:keys [num-tests fail seed]
    {:keys [smallest]} :shrunk}]
  (format "Failed after %d test(s)\nInput: %s\nShrunk to: %s\nSeed: %s"
          num-tests (format-args fail) (format-args smallest) seed))

(defn check
  "Wrap up quick-check to take options as a JS object and throw on failure"
  [property n & [opts]]
  (let [opts (apply concat (js->clj opts :keywordize-keys true))
        {:keys [result] :as r} (apply tc/quick-check n property opts)
        summary (clj->js r)
        failure (fn [ex]
                  (aset ex "checkers-result" summary)
                  (throw ex))]
    (cond
      (instance? js/Error result) (let [ex result]
                                    (aset ex "message"
                                          (str (.-message ex) "\n"
                                               (generate-message r)))
                                    (failure ex))
      (not result) (let [ex (js/Error. (generate-message r))]
                     (failure ex))
      :else summary)))

(aset js/exports "forAll"
      (fn [& args]
        (let [p (apply prop/for-all* args)]
          (aset p "check" #(check p %1 %2))
          p)))

(aset js/exports "sample" (comp into-array gen/sample))

;; Generator API

(aset js/exports "gen" #js {})


(aset js/exports "gen" "fmap" gen/fmap)
(aset js/exports "gen" "return" gen/return)
(aset js/exports "gen" "bind" gen/bind)

; Combinators & Helpers
(aset js/exports "gen" "resize" gen/resize)
(aset js/exports "gen" "choose" gen/choose)
(aset js/exports "gen" "oneOf" gen/one-of)
(aset js/exports "gen" "frequency" gen/frequency)
(aset js/exports "gen" "elements" gen/elements)
(aset js/exports "gen" "suchThat" gen/such-that)
(aset js/exports "gen" "notEmpty" gen/not-empty)
(aset js/exports "gen" "noShrink" gen/no-shrink)
(aset js/exports "gen" "shrink2" gen/shrink-2)

; Data Types
(aset js/exports "gen" "boolean" gen/boolean)
(aset js/exports "gen" "tuple" (arrayify gen/tuple))

(aset js/exports "gen" "int" gen/int)
(aset js/exports "gen" "nat" gen/nat)
(aset js/exports "gen" "posInt" gen/s-pos-int)
(aset js/exports "gen" "negInt" gen/s-neg-int)
(aset js/exports "gen" "zeroOrNegInt" gen/neg-int)

(aset js/exports "gen" "array" (arrayify gen/vector))
(aset js/exports "gen" "shuffle" (arrayify gen/shuffle))

(aset js/exports "gen" "obj" (objectify gen/map))
(def ^:private gen-hash-map (objectify gen/hash-map))
(aset js/exports "gen" "object"
      (fn [obj] (apply gen-hash-map (apply concat (obj-seq obj)))))

(aset js/exports "gen" "char" gen/char)
(aset js/exports "gen" "charAscii" gen/char-ascii)
(aset js/exports "gen" "charAlphanum" gen/char-alphanumeric)
(aset js/exports "gen" "charAlpha" gen/char-alpha)

(aset js/exports "gen" "string" gen/string)
(aset js/exports "gen" "stringAscii" gen/string-ascii)
(aset js/exports "gen" "stringAlphanum" gen/string-alphanumeric)
