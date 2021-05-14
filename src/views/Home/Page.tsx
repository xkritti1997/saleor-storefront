import "./scss/index.scss";

import classNames from "classnames";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { Button, Loader, ProductsFeatured } from "../../components";
import { generateCategoryUrl } from "../../core/utils";

import {
  ProductsList_categories,
  ProductsList_shop,
  ProductsList_shop_homepageCollection_backgroundImage,
} from "./gqlTypes/ProductsList";

import { structuredData } from "../../core/SEO/Homepage/structuredData";

import noPhotoImg from "../../images/no-photo.svg";

import axios from "axios";

const Page: React.FC<{
  loading: boolean;
  categories: ProductsList_categories;
  backgroundImage: ProductsList_shop_homepageCollection_backgroundImage;
  shop: ProductsList_shop;
}> = ({ loading, categories, backgroundImage, shop }) => {
  const categoriesExist = () => {
    return categories && categories.edges && categories.edges.length > 0;
  };
  const intl = useIntl();

  const [seconds, setSeconds] = useState(1);
  const [goldres, setGoldres] = useState([]);
  const [gold_date, setgold_date] = useState("");

  React.useEffect(() => {
    async function call_api_gold() {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const url_gold = `https://chinhuaheng.com/gold/now?=${timestamp}`;
      const res = await axios.get(
        `https://cors-anywhere.herokuapp.com/${url_gold}`
      );
      const golddate = new Date(Date.parse(res.data["date"]));
      setGoldres(goldres => res.data);
      console.log(res.data, timestamp);
      setgold_date(gold_date => golddate.toString());
      console.log(gold_date);
      setSeconds(timestamp);
    }

    if (seconds === 1) {
      call_api_gold();
    } else {
      const interval = setInterval(async () => {
        try {
          call_api_gold();
        } catch (error) {
          console.log(error, seconds);
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [seconds]);

  return (
    <>
      <script className="structured-data-list" type="application/ld+json">
        {structuredData(shop)}
      </script>
      <div
        className="home-page__hero"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage.url})` }
            : null
        }
      >
        <div className="home-page__hero-text">
          <div>
            <span className="home-page__hero__title">
              <h1>
                <FormattedMessage defaultMessage="Final reduction" />
              </h1>
            </span>
          </div>
          <div>
            <span className="home-page__hero__title">
              <h1>
                <FormattedMessage defaultMessage="Up to 70% off sale" />
              </h1>
            </span>
          </div>
        </div>
        <div className="home-page__hero-action">
          {loading && !categories ? (
            <Loader />
          ) : (
            categoriesExist() && (
              <Link
                to={generateCategoryUrl(
                  categories.edges[0].node.id,
                  categories.edges[0].node.name
                )}
              >
                <Button testingContext="homepageHeroActionButton">
                  <FormattedMessage defaultMessage="Shop sale" />
                </Button>
              </Link>
            )
          )}
        </div>
      </div>

      <div
        className="container"
        style={{
          fontFamily: "Prompt, sans-serif",
          minHeight: "196px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#a4ebf3",
            marginTop: "5px",
            padding: "5px 0px 5px 0px",
            fontSize: "25px",
            color: "black",
            textAlign: "center",
          }}
        >
          <h5>ราคาทองวันนี้</h5>
        </div>
        <div
          style={{
            backgroundColor: "#ccf2f4",
            height: "100%",
            paddingBottom: "15px",
          }}
        >
          {seconds > 1 ? (
            <span
              style={{
                fontSize: 14,
              }}
            >
              ราคาทองล่าสุด : {gold_date}
              (ครั้งที่ {goldres["gold"]["announce"]})
            </span>
          ) : (
            <span>loading ...</span>
          )}
          <div
            style={{
              border: "1px solid gold",
              backgroundColor: "#f4f9f9",
              margin: "10px 15px",
              padding: "10px 15px",
              verticalAlign: "middle",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              ราคาทองคำแท่ง
            </span>
            <div
              className="container"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  ขายออก
                </span>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  รับซื้อ
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                {seconds > 1 ? (
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "15px",
                      color: "red",
                    }}
                  >
                    {goldres["gold"]["gta_offer"]}
                  </span>
                ) : (
                  <span>loading ...</span>
                )}
                {seconds > 1 ? (
                  <span
                    style={{
                      color: "green",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {goldres["gold"]["gta_bid"]}
                  </span>
                ) : (
                  <span>loading ...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductsFeatured
        title={intl.formatMessage({ defaultMessage: "Featured" })}
      />
      {categoriesExist() && (
        <div className="home-page__categories">
          <div className="container">
            <h3>
              <FormattedMessage defaultMessage="Shop by category" />
            </h3>
            <div className="home-page__categories__list">
              {categories.edges.map(({ node: category }) => (
                <div key={category.id}>
                  <Link
                    to={generateCategoryUrl(category.id, category.name)}
                    key={category.id}
                  >
                    <div
                      className={classNames(
                        "home-page__categories__list__image",
                        {
                          "home-page__categories__list__image--no-photo": !category.backgroundImage,
                        }
                      )}
                      style={{
                        backgroundImage: `url(${
                          category.backgroundImage
                            ? category.backgroundImage.url
                            : noPhotoImg
                        })`,
                      }}
                    />
                    <h3>{category.name}</h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
